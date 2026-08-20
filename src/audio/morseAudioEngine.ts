import { AudioEngineSettings } from '../types';

export interface PlaybackCallback {
  onSymbolStart?: (info: { char: string; symbol: '.' | '-'; symbolIndex: number; charIndex: number }) => void;
  onSymbolEnd?: () => void;
  onCharStart?: (char: string, charIndex: number) => void;
  onComplete?: () => void;
}

export class MorseAudioEngine {
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private currentOscillator: OscillatorNode | null = null;
  private manualKeyGain: GainNode | null = null;
  private isPlaying = false;
  private stopPlaybackFlag = false;
  private scheduledTimeouts: number[] = [];

  private settings: AudioEngineSettings = {
    wpm: 15,
    frequency: 650,
    volume: 0.8,
    visualOnly: false,
  };

  constructor(initialSettings?: Partial<AudioEngineSettings>) {
    if (initialSettings) {
      this.settings = { ...this.settings, ...initialSettings };
    }
  }

  public updateSettings(newSettings: Partial<AudioEngineSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(this.settings.volume, this.audioCtx.currentTime);
    }
  }

  public getSettings(): AudioEngineSettings {
    return { ...this.settings };
  }

  private initAudio() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(this.settings.volume, this.audioCtx.currentTime);
      this.masterGain.connect(this.audioCtx.destination);
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  /**
   * PARIS基準に基づく1短点の基準時間 (ミリ秒)
   */
  public getDotDurationMs(wpm = this.settings.wpm): number {
    return 1200 / Math.max(1, wpm);
  }

  /**
   * 手動キーダウン時のトーン開始（フリー打鍵・タップ練習用）
   */
  public startManualTone(freq = this.settings.frequency) {
    if (this.settings.visualOnly) return;
    this.initAudio();
    if (!this.audioCtx || !this.masterGain) return;

    if (this.currentOscillator) {
      this.stopManualTone();
    }

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

    // クリックノイズ防止の微小フェードイン (5ms)
    const now = this.audioCtx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(1.0, now + 0.005);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);

    this.currentOscillator = osc;
    this.manualKeyGain = gain;
  }

  /**
   * 手動キーアップ時のトーン停止
   */
  public stopManualTone() {
    if (!this.audioCtx || !this.currentOscillator || !this.manualKeyGain) return;

    const now = this.audioCtx.currentTime;
    // クリックノイズ防止の微小フェードアウト (5ms)
    this.manualKeyGain.gain.setValueAtTime(this.manualKeyGain.gain.value, now);
    this.manualKeyGain.gain.linearRampToValueAtTime(0.0001, now + 0.005);

    const oscToStop = this.currentOscillator;
    setTimeout(() => {
      try {
        oscToStop.stop();
        oscToStop.disconnect();
      } catch {
        // ignore
      }
    }, 10);

    this.currentOscillator = null;
    this.manualKeyGain = null;
  }

  /**
   * 単発の短点・長点を再生
   */
  public async playSymbol(symbol: '.' | '-', customWpm?: number): Promise<void> {
    const dotDuration = this.getDotDurationMs(customWpm);
    const duration = symbol === '.' ? dotDuration : dotDuration * 3;

    if (!this.settings.visualOnly) {
      this.startManualTone();
    }

    // 触覚フィードバック（スマートフォン対応）
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(symbol === '.' ? 30 : 90);
      } catch {
        // ignore
      }
    }

    return new Promise(resolve => {
      setTimeout(() => {
        if (!this.settings.visualOnly) {
          this.stopManualTone();
        }
        resolve();
      }, duration);
    });
  }

  /**
   * モールス符号列（例: ".- -..." または単一文字 ".-"）を再生
   * @param morseString スペース区切りのモールス符号
   * @param callbacks 視覚同期・進捗用コールバック
   * @param customWpm 一時的な再生速度指定（省略時は設定値）
   */
  public async playMorse(
    morseString: string,
    callbacks?: PlaybackCallback,
    customWpm?: number,
    associatedText = ''
  ): Promise<void> {
    this.stopPlayback();
    this.isPlaying = true;
    this.stopPlaybackFlag = false;

    if (!this.settings.visualOnly) {
      this.initAudio();
    }

    const dotDuration = this.getDotDurationMs(customWpm || this.settings.wpm);
    const dashDuration = dotDuration * 3;
    const intraCharPause = dotDuration;       // 同一文字内の要素間隔: 1 unit
    const interCharPause = dotDuration * 3;     // 文字と文字の間隔: 3 units (intraCharPause後に追加で2 units)
    const interWordPause = dotDuration * 7;     // 単語と単語の間隔: 7 units

    // 単語や文字の分解
    // 例: ".- -..." -> charTokens: [".-", "-..."]
    const charTokens = morseString.trim().split(/\s+/);
    const textChars = associatedText ? Array.from(associatedText) : [];

    let globalSymbolIndex = 0;

    for (let cIdx = 0; cIdx < charTokens.length; cIdx++) {
      if (this.stopPlaybackFlag) break;

      const token = charTokens[cIdx];
      const correspondingChar = textChars[cIdx] || '';

      if (token === '/') {
        // 単語間スペース
        await this.sleep(interWordPause);
        continue;
      }

      callbacks?.onCharStart?.(correspondingChar, cIdx);

      // 文字内の各シンボル（. または -）を再生
      for (let sIdx = 0; sIdx < token.length; sIdx++) {
        if (this.stopPlaybackFlag) break;

        const sym = token[sIdx] as '.' | '-';
        if (sym !== '.' && sym !== '-') continue;

        const symDuration = sym === '.' ? dotDuration : dashDuration;

        callbacks?.onSymbolStart?.({
          char: correspondingChar,
          symbol: sym,
          symbolIndex: globalSymbolIndex++,
          charIndex: cIdx,
        });

        if (!this.settings.visualOnly) {
          this.startManualTone();
        }

        // スマホバイブレーション
        if ('vibrate' in navigator) {
          try {
            navigator.vibrate(sym === '.' ? 25 : 75);
          } catch {
            // ignore
          }
        }

        await this.sleep(symDuration);

        if (!this.settings.visualOnly) {
          this.stopManualTone();
        }
        callbacks?.onSymbolEnd?.();

        // シンボル間のポーズ（文字内の最後のシンボルでない場合）
        if (sIdx < token.length - 1) {
          await this.sleep(intraCharPause);
        }
      }

      // 文字間のポーズ（最後の文字でない場合）
      if (cIdx < charTokens.length - 1 && charTokens[cIdx + 1] !== '/') {
        await this.sleep(interCharPause);
      }
    }

    this.isPlaying = false;
    callbacks?.onComplete?.();
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => {
      const timeoutId = window.setTimeout(resolve, ms);
      this.scheduledTimeouts.push(timeoutId);
    });
  }

  /**
   * 現在の再生を即時中断
   */
  public stopPlayback() {
    this.stopPlaybackFlag = true;
    this.isPlaying = false;
    this.stopManualTone();

    // 予約されているタイマーをすべてクリア
    for (const id of this.scheduledTimeouts) {
      clearTimeout(id);
    }
    this.scheduledTimeouts = [];
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

// シングルトンインスタンス（全画面で設定とオーディオコンテキストを共有可能）
export const morseAudio = new MorseAudioEngine();
