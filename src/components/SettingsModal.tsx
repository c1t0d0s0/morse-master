import React from 'react';
import { X, Volume2, Eye, Sliders, Gauge, Music, Globe } from 'lucide-react';
import { AudioEngineSettings } from '../types';
import { useTranslation, LanguageMode } from '../i18n/LanguageContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AudioEngineSettings;
  onUpdateSettings: (newSettings: Partial<AudioEngineSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  const { languageMode, setLanguageMode, t } = useTranslation();

  if (!isOpen) return null;

  const wpmPresets = [
    { label: t.settingsModal.speedPresetBeginner, value: 10 },
    { label: t.settingsModal.speedPresetStandard, value: 15 },
    { label: t.settingsModal.speedPresetFast, value: 20 },
    { label: t.settingsModal.speedPresetExpert, value: 28 },
  ];

  const freqPresets = [
    { label: t.settingsModal.pitchPresetLow, value: 500 },
    { label: t.settingsModal.pitchPresetStandard, value: 650 },
    { label: t.settingsModal.pitchPresetHigh, value: 800 },
  ];

  const languageOptions: Array<{ mode: LanguageMode; label: string }> = [
    { mode: 'auto', label: t.settingsModal.languageAuto },
    { mode: 'ja', label: t.settingsModal.languageJa },
    { mode: 'en', label: t.settingsModal.languageEn },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition"
          aria-label={t.settingsModal.closeButton}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
            <Sliders size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">{t.settingsModal.title}</h2>
            <p className="text-xs text-slate-400">{t.settingsModal.subtitle}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Language Selection */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2.5">
            <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Globe size={16} className="text-cyan-400" />
              {t.settingsModal.languageLabel}
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {languageOptions.map(opt => (
                <button
                  key={opt.mode}
                  type="button"
                  onClick={() => setLanguageMode(opt.mode)}
                  className={`text-xs py-2 px-2 rounded-lg border font-semibold transition text-center ${
                    languageMode === opt.mode
                      ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 shadow-sm shadow-cyan-500/10'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Visual Only Mode (消音環境向け記号表示) */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${settings.visualOnly ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
                {settings.visualOnly ? <Eye size={20} /> : <Volume2 size={20} />}
              </div>
              <div>
                <div className="font-semibold text-sm text-slate-200">{t.settingsModal.visualOnlyLabel}</div>
                <div className="text-xs text-slate-400">{t.settingsModal.visualOnlyDesc}</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.visualOnly}
                onChange={e => onUpdateSettings({ visualOnly: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {/* Speed (WPM) Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                <Gauge size={16} className="text-cyan-400" />
                {t.settingsModal.speedLabel}
              </label>
              <span className="font-mono font-bold text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800 text-sm">
                {settings.wpm} WPM ({t.settingsModal.dotDuration.replace('{ms}', String(Math.round(1200 / settings.wpm)))})
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="35"
              step="1"
              value={settings.wpm}
              onChange={e => onUpdateSettings({ wpm: Number(e.target.value) })}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            {/* WPM Presets */}
            <div className="grid grid-cols-4 gap-2 mt-2">
              {wpmPresets.map(preset => (
                <button
                  key={preset.value}
                  onClick={() => onUpdateSettings({ wpm: preset.value })}
                  className={`text-xs py-1 px-2 rounded-lg border transition truncate ${
                    settings.wpm === preset.value
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                  }`}
                  title={preset.label}
                >
                  {preset.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Frequency (Pitch) */}
          {!settings.visualOnly && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                  <Music size={16} className="text-cyan-400" />
                  {t.settingsModal.pitchLabel}
                </label>
                <span className="font-mono font-bold text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800 text-sm">
                  {settings.frequency} Hz
                </span>
              </div>
              <input
                type="range"
                min="400"
                max="1000"
                step="25"
                value={settings.frequency}
                onChange={e => onUpdateSettings({ frequency: Number(e.target.value) })}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="grid grid-cols-3 gap-2 mt-2">
                {freqPresets.map(preset => (
                  <button
                    key={preset.value}
                    onClick={() => onUpdateSettings({ frequency: preset.value })}
                    className={`text-xs py-1 px-2 rounded-lg border transition ${
                      settings.frequency === preset.value
                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Master Volume */}
          {!settings.visualOnly && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                  <Volume2 size={16} className="text-cyan-400" />
                  {t.settingsModal.volumeLabel}
                </label>
                <span className="font-mono font-bold text-cyan-400 text-sm">
                  {Math.round(settings.volume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.volume}
                onChange={e => onUpdateSettings({ volume: Number(e.target.value) })}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl shadow-lg transition"
          >
            {t.settingsModal.closeButton}
          </button>
        </div>
      </div>
    </div>
  );
};
