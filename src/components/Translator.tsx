import React, { useState } from 'react';
import { Repeat, Play, Square, Copy, Check, Sparkles } from 'lucide-react';
import { textToMorse, morseToDotsAndDashes } from '../data/morseData';
import { AudioEngineSettings } from '../types';
import { morseAudio } from '../audio/morseAudioEngine';
import { MorseVisualizer } from './MorseVisualizer';

interface TranslatorProps {
  settings: AudioEngineSettings;
}

export const Translator: React.FC<TranslatorProps> = ({ settings }) => {
  const [inputText, setInputText] = useState<string>('SOS');
  const [isWabunMode, setIsWabunMode] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeSymbol, setActiveSymbol] = useState<'.' | '-' | null>(null);
  const [activeCharIndex, setActiveCharIndex] = useState<number>(-1);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // 変換計算
  const converted = textToMorse(inputText, isWabunMode);
  const morseDisplay = converted.code ? morseToDotsAndDashes(converted.code) : '';

  // プリセットサンプル
  const samplePresets = [
    { label: 'SOS (救難信号)', text: 'SOS', wabun: false },
    { label: 'CQ (各局呼出)', text: 'CQ CQ CQ', wabun: false },
    { label: '73 (Best Regards)', text: '73', wabun: false },
    { label: 'こんにちは', text: 'コンニチハ', wabun: true },
    { label: '本日晴天ナリ', text: 'ホンジツセイテンナリ', wabun: true },
    { label: 'モールス信号', text: 'モールスシンゴウ', wabun: true },
  ];

  const handlePlay = async () => {
    if (!converted.code || isPlaying) return;
    setIsPlaying(true);

    await morseAudio.playMorse(
      converted.code,
      {
        onSymbolStart: info => {
          setActiveSymbol(info.symbol);
          setActiveCharIndex(info.charIndex);
        },
        onSymbolEnd: () => {
          setActiveSymbol(null);
        },
        onComplete: () => {
          setIsPlaying(false);
          setActiveSymbol(null);
          setActiveCharIndex(-1);
        },
      },
      settings.wpm,
      inputText
    );
  };

  const handleStop = () => {
    morseAudio.stopPlayback();
    setIsPlaying(false);
    setActiveSymbol(null);
    setActiveCharIndex(-1);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 backdrop-blur shadow-md flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Repeat size={22} className="text-cyan-400" />
            モールス信号 翻訳＆再生機
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            日本語（カタカナ/ひらがな）やアルファベット・数字を即座にモールス信号に変換・再生します。
          </p>
        </div>

        {/* Japanese Wabun Mode Toggle */}
        <div className="flex items-center gap-2 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setIsWabunMode(false)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              !isWabunMode
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            欧文 / 数字
          </button>
          <button
            onClick={() => setIsWabunMode(true)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              isWabunMode
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            和文 (カナ)
          </button>
        </div>
      </div>

      {/* Preset Quick Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-xs font-semibold text-slate-400 whitespace-nowrap flex items-center gap-1">
          <Sparkles size={13} className="text-amber-400" />
          定番文:
        </span>
        {samplePresets.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => {
              setInputText(preset.text);
              setIsWabunMode(preset.wabun);
            }}
            className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition whitespace-nowrap"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Main Translation Cards */}
      <div className="space-y-4">
        {/* Input Text Area */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <label className="text-xs uppercase font-mono tracking-widest text-slate-400 block mb-2">
            変換元テキスト (INPUT TEXT)
          </label>
          <textarea
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder={isWabunMode ? 'カタカナまたはひらがなを入力...' : 'アルファベット・数字を入力...'}
            rows={3}
            className="w-full bg-slate-950/80 border border-slate-700 focus:border-cyan-400 rounded-2xl p-4 text-lg font-semibold text-slate-100 placeholder-slate-600 focus:outline-none transition resize-none shadow-inner"
          />
        </div>

        {/* Visualizer and Player */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <MorseVisualizer
            isActive={activeSymbol !== null}
            currentSymbol={activeSymbol}
            symbolText={morseDisplay}
            isVisualOnly={settings.visualOnly}
            showTextSymbol={true}
          />

          {/* Player controls */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {!isPlaying ? (
              <button
                onClick={handlePlay}
                disabled={!converted.code}
                className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-slate-950 font-extrabold rounded-2xl shadow-xl shadow-cyan-500/20 hover:scale-105 transition"
              >
                <Play size={18} fill="currentColor" />
                <span>モールス信号を再生</span>
              </button>
            ) : (
              <button
                onClick={handleStop}
                className="flex items-center gap-2 px-8 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold rounded-2xl shadow-xl shadow-rose-600/30 transition animate-pulse"
              >
                <Square size={18} fill="currentColor" />
                <span>停止</span>
              </button>
            )}
          </div>

          {/* Morse Code Result Area */}
          <div className="bg-slate-950/90 rounded-2xl p-4 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-mono tracking-widest text-slate-400">
                モールス符号 (DOTS & DASHES)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(morseDisplay, 'dots')}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition"
                >
                  {copiedType === 'dots' ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copiedType === 'dots' ? 'コピー完了' : '記号コピー (・－)'}</span>
                </button>
                <button
                  onClick={() => copyToClipboard(converted.code, 'raw')}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition"
                >
                  {copiedType === 'raw' ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copiedType === 'raw' ? 'コピー完了' : 'Rawコピー (.-)'}</span>
                </button>
              </div>
            </div>

            <div className="font-mono text-xl sm:text-2xl font-bold text-amber-300 tracking-[0.2em] break-all select-all min-h-[40px] flex items-center">
              {morseDisplay || <span className="text-slate-600 text-sm">テキストを入力すると符号が表示されます</span>}
            </div>
          </div>

          {/* Breakdown cards */}
          {converted.items.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 mb-2">文字ごとの分解:</div>
              <div className="flex flex-wrap gap-2">
                {converted.items.map((item, idx) => (
                  <div
                    key={idx}
                    className={`px-3 py-2 rounded-xl border flex items-center gap-2 transition ${
                      activeCharIndex === idx
                        ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.6)] scale-105'
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <span className="font-bold text-white text-base">{item.char}</span>
                    <span className="font-mono text-xs font-bold text-cyan-400">
                      {morseToDotsAndDashes(item.code)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
