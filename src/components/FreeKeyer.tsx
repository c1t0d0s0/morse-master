import React, { useState, useEffect, useRef } from 'react';
import { Radio, Trash2, Copy, Check } from 'lucide-react';
import { morseAudio } from '../audio/morseAudioEngine';
import { morseToText, morseToDotsAndDashes } from '../data/morseData';
import { AudioEngineSettings, KeyingMode } from '../types';
import { MorseVisualizer } from './MorseVisualizer';

interface FreeKeyerProps {
  settings: AudioEngineSettings;
}

export const FreeKeyer: React.FC<FreeKeyerProps> = ({ settings }) => {
  const [isWabun, setIsWabun] = useState<boolean>(false);
  const [keyingMode, setKeyingMode] = useState<KeyingMode>('paddle');
  const [isPressing, setIsPressing] = useState<boolean>(false);
  const [currentSymbol, setCurrentSymbol] = useState<'.' | '-' | null>(null);
  
  // 自動デコード用バッファ
  const [currentMorseBuffer, setCurrentMorseBuffer] = useState<string>('');
  const [decodedMessage, setDecodedMessage] = useState<string>('');
  const [morseHistory, setMorseHistory] = useState<string[]>([]);
  const [copied, setCopied] = useState<boolean>(false);

  const keyDownTimeRef = useRef<number | null>(null);
  const pauseTimerRef = useRef<number | null>(null);

  // 最後の入力からの無音時間で文字確定タイマーを動かす
  const resetPauseTimer = (currentBuffer: string) => {
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
    }

    const dotDuration = morseAudio.getDotDurationMs(settings.wpm);
    // 文字間スペース判定（短点3個分）
    pauseTimerRef.current = window.setTimeout(() => {
      if (currentBuffer) {
        const decodedChar = morseToText(currentBuffer, isWabun);
        setDecodedMessage(prev => prev + decodedChar);
        setMorseHistory(prev => [...prev, currentBuffer]);
        setCurrentMorseBuffer('');
      }
    }, dotDuration * 3.5);
  };

  // パドル入力
  const handlePaddleInput = (symbol: '.' | '-') => {
    setCurrentSymbol(symbol);
    setIsPressing(true);
    morseAudio.playSymbol(symbol);

    setTimeout(() => {
      setIsPressing(false);
      setCurrentSymbol(null);
    }, symbol === '.' ? morseAudio.getDotDurationMs() : morseAudio.getDotDurationMs() * 3);

    setCurrentMorseBuffer(prev => {
      const next = prev + symbol;
      resetPauseTimer(next);
      return next;
    });
  };

  // ストレートキー押下
  const handleStraightDown = () => {
    if (keyDownTimeRef.current !== null) return;
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);

    keyDownTimeRef.current = Date.now();
    setIsPressing(true);
    morseAudio.startManualTone();
  };

  // ストレートキー離す
  const handleStraightUp = () => {
    if (keyDownTimeRef.current === null) return;
    const duration = Date.now() - keyDownTimeRef.current;
    keyDownTimeRef.current = null;
    setIsPressing(false);
    morseAudio.stopManualTone();

    const dotDuration = morseAudio.getDotDurationMs(settings.wpm);
    const symbol: '.' | '-' = duration > dotDuration * 1.8 ? '-' : '.';
    setCurrentSymbol(symbol);
    setTimeout(() => setCurrentSymbol(null), 100);

    setCurrentMorseBuffer(prev => {
      const next = prev + symbol;
      resetPauseTimer(next);
      return next;
    });
  };

  // キーボードイベント
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (keyingMode === 'paddle') {
        if (e.key === 'j' || e.key === 'J') {
          e.preventDefault();
          handlePaddleInput('.');
        } else if (e.key === 'k' || e.key === 'K') {
          e.preventDefault();
          handlePaddleInput('-');
        } else if (e.key === ' ') {
          e.preventDefault();
          setDecodedMessage(prev => prev + ' ');
        }
      } else {
        if (e.code === 'Space' && !e.repeat) {
          e.preventDefault();
          handleStraightDown();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (keyingMode === 'straight' && e.code === 'Space') {
        e.preventDefault();
        handleStraightUp();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [keyingMode, isWabun, settings.wpm]);

  const handleClear = () => {
    setCurrentMorseBuffer('');
    setDecodedMessage('');
    setMorseHistory([]);
  };

  const copyText = () => {
    navigator.clipboard.writeText(decodedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 backdrop-blur shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Radio size={22} className="text-cyan-400" />
            フリー電信機 (Free Morse Keyer)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            好きなリズムで打鍵すると、自動的にモールス信号を認識してテキストに解読します。
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setIsWabun(false)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                !isWabun ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              欧文
            </button>
            <button
              onClick={() => setIsWabun(true)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                isWabun ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              和文
            </button>
          </div>

          <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setKeyingMode('paddle')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                keyingMode === 'paddle' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              パドル
            </button>
            <button
              onClick={() => setKeyingMode('straight')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                keyingMode === 'straight' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              電鍵
            </button>
          </div>
        </div>
      </div>

      {/* Main Keyer Board */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur shadow-2xl space-y-6">
        {/* Signal & Visualizer */}
        <MorseVisualizer
          isActive={isPressing}
          currentSymbol={currentSymbol}
          symbolText={currentMorseBuffer ? morseToDotsAndDashes(currentMorseBuffer) : undefined}
          isVisualOnly={settings.visualOnly}
          showTextSymbol={true}
        />

        {/* Live Decoded Output Screen (Fixed height layout) */}
        <div className="bg-slate-950/90 rounded-2xl p-4 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono tracking-widest text-slate-400">
              解読されたメッセージ (DECODED MESSAGE)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={copyText}
                disabled={!decodedMessage}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 disabled:opacity-40 text-slate-300 hover:text-white text-xs font-semibold transition"
              >
                {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                <span>{copied ? 'コピー完了' : 'コピー'}</span>
              </button>
              <button
                onClick={handleClear}
                disabled={!decodedMessage && !currentMorseBuffer}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 disabled:opacity-40 text-slate-300 hover:text-rose-400 text-xs font-semibold transition"
              >
                <Trash2 size={13} />
                <span>クリア</span>
              </button>
            </div>
          </div>

          {/* Text Output Box with fixed height */}
          <div className="h-14 flex items-center bg-slate-900/60 rounded-xl px-4 border border-slate-800/80 overflow-x-auto no-scrollbar">
            <div className="text-xl sm:text-2xl font-black text-white tracking-wider flex items-center gap-1 whitespace-nowrap">
              <span>{decodedMessage}</span>
              {currentMorseBuffer && (
                <span className="text-amber-400 font-mono text-lg sm:text-xl bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/50 animate-pulse">
                  {morseToDotsAndDashes(currentMorseBuffer)}
                </span>
              )}
              <span className="inline-block w-2 h-5 bg-cyan-400 animate-pulse ml-0.5 shrink-0" />
            </div>
          </div>

          {/* History of Morse Tokens (Fixed height slot) */}
          <div className="h-6 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {morseHistory.length > 0 ? (
              morseHistory.map((code, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-mono bg-slate-900 px-2 py-0.5 rounded text-cyan-400 border border-slate-800 shrink-0"
                >
                  {morseToDotsAndDashes(code)}
                </span>
              ))
            ) : (
              <span className="text-[11px] text-slate-600 font-mono">符号履歴がここに表示されます</span>
            )}
          </div>
        </div>

        {/* Keying Controller */}
        {keyingMode === 'paddle' ? (
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onPointerDown={() => handlePaddleInput('.')}
              className="h-32 bg-gradient-to-b from-slate-800 to-slate-900 active:from-cyan-600 active:to-cyan-700 active:scale-95 text-slate-100 rounded-3xl border-2 border-slate-700 active:border-cyan-400 shadow-xl flex flex-col items-center justify-center gap-1 transition-all select-none touch-manipulation cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.9)]" />
              <span className="text-xl font-black">短点 ( ・ )</span>
              <span className="text-xs font-mono text-slate-400">キー [ J ]</span>
            </button>

            <button
              type="button"
              onPointerDown={() => handlePaddleInput('-')}
              className="h-32 bg-gradient-to-b from-slate-800 to-slate-900 active:from-blue-600 active:to-blue-700 active:scale-95 text-slate-100 rounded-3xl border-2 border-slate-700 active:border-blue-400 shadow-xl flex flex-col items-center justify-center gap-1 transition-all select-none touch-manipulation cursor-pointer"
            >
              <div className="w-14 h-5 rounded-full bg-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.9)]" />
              <span className="text-xl font-black">長点 ( － )</span>
              <span className="text-xs font-mono text-slate-400">キー [ K ]</span>
            </button>
          </div>
        ) : (
          <div>
            <button
              type="button"
              onPointerDown={handleStraightDown}
              onPointerUp={handleStraightUp}
              onPointerLeave={handleStraightUp}
              className={`w-full h-40 rounded-3xl border-2 shadow-2xl flex flex-col items-center justify-center gap-2 transition-all select-none touch-manipulation cursor-pointer ${
                isPressing
                  ? 'bg-amber-500 border-amber-300 scale-95 shadow-[0_0_35px_rgba(245,158,11,0.9)]'
                  : 'bg-gradient-to-b from-slate-800 to-slate-900 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className={`w-10 h-10 rounded-full border-4 ${isPressing ? 'bg-white border-amber-200' : 'bg-slate-700 border-slate-600'}`} />
              <span className="text-2xl font-black text-white">
                {isPressing ? '電信発信中 (TRANSMITTING)' : '電鍵をタップ / 長押し'}
              </span>
              <span className="text-xs text-slate-400 font-mono">PCキー: [ Space ] または画面タップ</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
