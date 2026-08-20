import React from 'react';
import { Headphones, Radio, BookOpen, Repeat, Settings, Zap, Volume2, Eye } from 'lucide-react';
import { QuizMode, AudioEngineSettings } from '../types';

interface NavbarProps {
  currentMode: QuizMode;
  onSelectMode: (mode: QuizMode) => void;
  onOpenSettings: () => void;
  settings: AudioEngineSettings;
  onToggleVisualOnly: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  onOpenSettings,
  settings,
  onToggleVisualOnly,
}) => {
  const navItems: Array<{ mode: QuizMode; label: string; icon: React.ReactNode }> = [
    { mode: 'listening', label: '聞き取り練習', icon: <Headphones size={18} /> },
    { mode: 'tapping', label: 'タップ送信練習', icon: <Zap size={18} /> },
    { mode: 'reference', label: '符号一覧表', icon: <BookOpen size={18} /> },
    { mode: 'translator', label: '翻訳＆再生', icon: <Repeat size={18} /> },
    { mode: 'free-keyer', label: 'フリー電信機', icon: <Radio size={18} /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-slate-950 font-black text-xl">
              <Radio size={22} className="text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                  モールスマスター
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/80 text-cyan-400 font-bold hidden sm:inline">
                  Morse Master
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">欧文・数字・和文モールス学習</p>
            </div>
          </div>

          {/* Quick Header Controls */}
          <div className="flex items-center gap-2">
            {/* Quick Visual/Sound Mode Toggle */}
            <button
              onClick={onToggleVisualOnly}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                settings.visualOnly
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
              }`}
              title={settings.visualOnly ? '消音視覚モード中（クリックで音声ON）' : '音声再生中（クリックで消音視覚モード）'}
            >
              {settings.visualOnly ? (
                <>
                  <Eye size={15} />
                  <span className="hidden sm:inline">消音・視覚</span>
                </>
              ) : (
                <>
                  <Volume2 size={15} className="text-emerald-400" />
                  <span className="hidden sm:inline">{settings.wpm} WPM</span>
                </>
              )}
            </button>

            {/* Settings Button */}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition"
              aria-label="設定"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Mobile scrollable) */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-2 -mb-px border-t border-slate-900 sm:border-t-0">
          {navItems.map(item => {
            const isActive = currentMode === item.mode;
            return (
              <button
                key={item.mode}
                onClick={() => onSelectMode(item.mode)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
