import React, { useState } from 'react';
import { Search, Volume2, BookOpen } from 'lucide-react';
import { ALPHABET_MORSE, NUMBER_MORSE, WABUN_MORSE, SYMBOL_MORSE, morseToDotsAndDashes } from '../data/morseData';
import { MorseItem, MorseCategory, AudioEngineSettings } from '../types';
import { morseAudio } from '../audio/morseAudioEngine';

interface ReferenceChartProps {
  settings?: AudioEngineSettings;
}

export const ReferenceChart: React.FC<ReferenceChartProps> = () => {
  const [activeTab, setActiveTab] = useState<MorseCategory | 'all'>('alphabet');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [playingCode, setPlayingCode] = useState<string | null>(null);

  const tabs: Array<{ id: MorseCategory | 'all'; label: string; count: number }> = [
    { id: 'alphabet', label: 'アルファベット (A-Z)', count: ALPHABET_MORSE.length },
    { id: 'number', label: '数字 (0-9)', count: NUMBER_MORSE.length },
    { id: 'wabun', label: '和文モールス (カナ)', count: WABUN_MORSE.length },
    { id: 'symbol', label: '記号', count: SYMBOL_MORSE.length },
    { id: 'all', label: 'すべて表示', count: ALPHABET_MORSE.length + NUMBER_MORSE.length + WABUN_MORSE.length + SYMBOL_MORSE.length },
  ];

  const getItemsForTab = (): MorseItem[] => {
    switch (activeTab) {
      case 'alphabet': return ALPHABET_MORSE;
      case 'number': return NUMBER_MORSE;
      case 'wabun': return WABUN_MORSE;
      case 'symbol': return SYMBOL_MORSE;
      case 'all': return [...ALPHABET_MORSE, ...NUMBER_MORSE, ...WABUN_MORSE, ...SYMBOL_MORSE];
    }
  };

  const filteredItems = getItemsForTab().filter(item => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const dots = morseToDotsAndDashes(item.code);
    return (
      item.char.toLowerCase().includes(q) ||
      item.nameJa.toLowerCase().includes(q) ||
      item.code.includes(q) ||
      dots.includes(q) ||
      (item.mnemonic && item.mnemonic.toLowerCase().includes(q))
    );
  });

  const playItemSound = async (item: MorseItem) => {
    setPlayingCode(item.code);
    await morseAudio.playMorse(item.code, {
      onComplete: () => setPlayingCode(null),
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 backdrop-blur shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <BookOpen size={22} className="text-cyan-400" />
            モールス符号一覧表 (Reference Chart)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            各カードをクリックすると音声を試聴できます。覚え方（語呂合わせ）も確認できます。
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="文字・読み・符号で検索..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-950/30">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {filteredItems.map((item, idx) => {
          const isPlaying = playingCode === item.code;
          return (
            <div
              key={`${item.category}-${item.char}-${idx}`}
              onClick={() => playItemSound(item)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer select-none group relative overflow-hidden ${
                isPlaying
                  ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-102'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl font-black text-white group-hover:text-cyan-300 transition">
                  {item.char}
                </span>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    playItemSound(item);
                  }}
                  className={`p-2 rounded-xl border transition ${
                    isPlaying
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400 group-hover:text-white group-hover:bg-slate-700'
                  }`}
                  aria-label={`${item.char}の音を再生`}
                >
                  <Volume2 size={16} />
                </button>
              </div>

              {/* Morse Dots and Dashes */}
              <div className="mt-3">
                <div className="font-mono text-base sm:text-lg font-extrabold text-amber-300 tracking-widest">
                  {morseToDotsAndDashes(item.code)}
                </div>
                <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                  {item.code}
                </div>
              </div>

              {/* Japanese Name & Mnemonic */}
              <div className="mt-2 pt-2 border-t border-slate-800/80">
                <div className="text-xs text-slate-300 font-semibold">{item.nameJa}</div>
                {item.mnemonic && (
                  <div className="text-[11px] text-cyan-400/90 mt-0.5 line-clamp-1 group-hover:line-clamp-none transition-all">
                    {item.mnemonic}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="p-12 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-500">
          「{searchQuery}」に一致するモールス符号は見つかりませんでした。
        </div>
      )}
    </div>
  );
};
