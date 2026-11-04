import React, { useState, useEffect, useRef } from 'react';
import { Radio, Trash2, Copy, Check } from 'lucide-react';
import { morseAudio } from '../audio/morseAudioEngine';
import { morseToText, morseToDotsAndDashes } from '../data/morseData';
import { AudioEngineSettings, KeyingMode } from '../types';
import { MorseVisualizer } from './MorseVisualizer';
import { MorseTreeBoard } from './MorseTreeBoard';
import { useTranslation } from '../i18n/LanguageContext';

interface FreeKeyerProps {
  settings: AudioEngineSettings;
}

export const FreeKeyer: React.FC<FreeKeyerProps> = ({ settings }) => {
  const { t } = useTranslation();
  const [isWabun, setIsWabun] = useState<boolean>(false);
  const [keyingMode, setKeyingMode] = useState<KeyingMode>('paddle');
  const [isPressing, setIsPressing] = useState<boolean>(false);
  const [currentSymbol, setCurrentSymbol] = useState<'.' | '-' | null>(null);
  
  // 自動デコード用バッファ
  const [currentMorseBuffer, setCurrentMorseBuffer] = useState<string>('');
  const [decodedMessage, setDecodedMessage] = useState<string>('');
  const [morseHistory, setMorseHistory] = useState<string[]>([]);
  const [copied, setCopied] = useState<boolean>(false);
  // ツリー盤用: 確定直後の文字を次の入力まで点灯させておく
  const [lastCommittedCode, setLastCommittedCode] = useState<string>('');

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
        setLastCommittedCode(currentBuffer);
        setCurrentMorseBuffer('');
      }
    }, dotDuration * 3.5);
  };

  // パドル入力
  const handlePaddleInput = (symbol: '.' | '-') => {
    setLastCommittedCode('');
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
    setLastCommittedCode('');
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
    setLastCommittedCode('');
  };

  const copyText = () => {
    navigator.clipboard.writeText(decodedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
      {/* Header */}
      <div className="bg-slate-900/90 p-3.5 sm:p-4 rounded-2xl border border-slate-800 backdrop-blur shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
            <Radio size={20} className="text-cyan-400" />
            {t.freeKeyer.title}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t.freeKeyer.subtitle}
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-950/60 p-0.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setIsWabun(false)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                !isWabun ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.freeKeyer.modeWestern}
            </button>
            <button
              onClick={() => setIsWabun(true)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                isWabun ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.freeKeyer.modeWabun}
            </button>
          </div>

          <div className="flex items-center gap-1 bg-slate-950/60 p-0.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setKeyingMode('paddle')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                keyingMode === 'paddle' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.freeKeyer.modePaddle}
            </button>
            <button
              onClick={() => setKeyingMode('straight')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                keyingMode === 'straight' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.freeKeyer.modeStraight}
            </button>
          </div>
        </div>
      </div>

      {/* Main Keyer Board */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 backdrop-blur shadow-2xl space-y-3">
        {/* Signal & Visualizer */}
        <MorseVisualizer
          isActive={isPressing}
          currentSymbol={currentSymbol}
          symbolText={currentMorseBuffer ? morseToDotsAndDashes(currentMorseBuffer) : undefined}
          isVisualOnly={settings.visualOnly}
          showTextSymbol={true}
        />

        {/* Morse Tree Board (Alphabet only) */}
        {!isWabun && (
          <MorseTreeBoard
            code={currentMorseBuffer || lastCommittedCode}
            committed={!currentMorseBuffer && Boolean(lastCommittedCode)}
            isActive={isPressing}
          />
        )}

        {/* Live Decoded Output Screen (Fixed height layout) */}
        <div className="bg-slate-950/90 rounded-2xl p-3 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
              {t.freeKeyer.outputLabel}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={copyText}
                disabled={!decodedMessage}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 disabled:opacity-40 text-slate-300 hover:text-white text-xs font-semibold transition"
              >
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copied ? t.freeKeyer.copied : t.freeKeyer.copy}</span>
              </button>
              <button
                onClick={handleClear}
                disabled={!decodedMessage && !currentMorseBuffer}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 disabled:opacity-40 text-slate-300 hover:text-rose-400 text-xs font-semibold transition"
              >
                <Trash2 size={12} />
                <span>{t.freeKeyer.clear}</span>
              </button>
            </div>
          </div>

          {/* Text Output Box with fixed height */}
          <div className="h-12 flex items-center bg-slate-900/60 rounded-xl px-3.5 border border-slate-800/80 overflow-x-auto no-scrollbar">
            <div className="text-lg sm:text-xl font-black text-white tracking-wider flex items-center gap-1 whitespace-nowrap">
              <span>{decodedMessage}</span>
              {currentMorseBuffer && (
                <span className="text-amber-400 font-mono text-base sm:text-lg bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/50 animate-pulse">
                  {morseToDotsAndDashes(currentMorseBuffer)}
                </span>
              )}
              <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse ml-0.5 shrink-0" />
            </div>
          </div>

          {/* History of Morse Tokens (Fixed height slot) */}
          <div className="h-5 flex items-center gap-1 overflow-x-auto no-scrollbar">
            {morseHistory.length > 0 ? (
              morseHistory.map((code, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-mono bg-slate-900 px-1.5 py-0.5 rounded text-cyan-400 border border-slate-800 shrink-0"
                >
                  {morseToDotsAndDashes(code)}
                </span>
              ))
            ) : (
              <span className="text-[10px] text-slate-600 font-mono">{t.freeKeyer.historyPlaceholder}</span>
            )}
          </div>
        </div>

        {/* Keying Controller */}
        {keyingMode === 'paddle' ? (
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onPointerDown={() => handlePaddleInput('.')}
              className="h-20 sm:h-24 bg-gradient-to-b from-slate-800 to-slate-900 active:from-cyan-600 active:to-cyan-700 active:scale-95 text-slate-100 rounded-2xl border-2 border-slate-700 active:border-cyan-400 shadow-xl flex flex-col items-center justify-center gap-0.5 transition-all select-none touch-manipulation cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.9)]" />
              <span className="text-lg font-black">{t.freeKeyer.dotButton}</span>
              <span className="text-[10px] font-mono text-slate-400">{t.freeKeyer.keyJ}</span>
            </button>

            <button
              type="button"
              onPointerDown={() => handlePaddleInput('-')}
              className="h-20 sm:h-24 bg-gradient-to-b from-slate-800 to-slate-900 active:from-blue-600 active:to-blue-700 active:scale-95 text-slate-100 rounded-2xl border-2 border-slate-700 active:border-blue-400 shadow-xl flex flex-col items-center justify-center gap-0.5 transition-all select-none touch-manipulation cursor-pointer"
            >
              <div className="w-12 h-3.5 rounded-full bg-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.9)]" />
              <span className="text-lg font-black">{t.freeKeyer.dashButton}</span>
              <span className="text-[10px] font-mono text-slate-400">{t.freeKeyer.keyK}</span>
            </button>
          </div>
        ) : (
          <div>
            <button
              type="button"
              onPointerDown={handleStraightDown}
              onPointerUp={handleStraightUp}
              onPointerLeave={handleStraightUp}
              className={`w-full h-24 sm:h-28 rounded-2xl border-2 shadow-xl flex flex-col items-center justify-center gap-1 transition-all select-none touch-manipulation cursor-pointer ${
                isPressing
                  ? 'bg-amber-500 border-amber-300 scale-95 shadow-[0_0_25px_rgba(245,158,11,0.9)]'
                  : 'bg-gradient-to-b from-slate-800 to-slate-900 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className={`w-7 h-7 rounded-full border-2 ${isPressing ? 'bg-white border-amber-200' : 'bg-slate-700 border-slate-600'}`} />
              <span className="text-lg font-black text-white">
                {isPressing ? t.freeKeyer.transmitting : t.freeKeyer.straightIdle}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">{t.freeKeyer.pcKeyHelp}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
