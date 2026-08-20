import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ListeningQuiz } from './components/ListeningQuiz';
import { TappingQuiz } from './components/TappingQuiz';
import { ReferenceChart } from './components/ReferenceChart';
import { Translator } from './components/Translator';
import { FreeKeyer } from './components/FreeKeyer';
import { SettingsModal } from './components/SettingsModal';
import { QuizMode, AudioEngineSettings } from './types';
import { morseAudio } from './audio/morseAudioEngine';
import { Radio, Keyboard, Volume2 } from 'lucide-react';

export const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<QuizMode>('listening');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [settings, setSettings] = useState<AudioEngineSettings>(() => morseAudio.getSettings());

  const handleUpdateSettings = (newSettings: Partial<AudioEngineSettings>) => {
    morseAudio.updateSettings(newSettings);
    setSettings(morseAudio.getSettings());
  };

  const handleToggleVisualOnly = () => {
    handleUpdateSettings({ visualOnly: !settings.visualOnly });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
        settings={settings}
        onToggleVisualOnly={handleToggleVisualOnly}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-3 sm:py-4">
        {currentMode === 'listening' && (
          <ListeningQuiz
            settings={settings}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {currentMode === 'tapping' && (
          <TappingQuiz settings={settings} />
        )}

        {currentMode === 'reference' && (
          <ReferenceChart settings={settings} />
        )}

        {currentMode === 'translator' && (
          <Translator settings={settings} />
        )}

        {currentMode === 'free-keyer' && (
          <FreeKeyer settings={settings} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-3 text-slate-500 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Radio size={16} className="text-cyan-400" />
            <span className="font-semibold text-slate-400">モールスマスター (Morse Master)</span>
            <span className="hidden sm:inline text-slate-700">|</span>
            <span className="hidden sm:inline">欧文・数字・和文モールス対応</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              <Keyboard size={14} className="text-slate-500" />
              <span>PC: J (短点) / K (長点) / Space</span>
            </span>
            <span className="flex items-center gap-1">
              <Volume2 size={14} className="text-slate-500" />
              <span>Web Audio API</span>
            </span>
          </div>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />
    </div>
  );
};

export default App;
