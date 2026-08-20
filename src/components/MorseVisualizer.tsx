import React from 'react';
import { Volume2, Eye } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

interface MorseVisualizerProps {
  isActive: boolean;
  currentSymbol?: '.' | '-' | null;
  symbolText?: string;
  isVisualOnly?: boolean;
  showTextSymbol?: boolean;
}

export const MorseVisualizer: React.FC<MorseVisualizerProps> = ({
  isActive,
  currentSymbol,
  symbolText,
  isVisualOnly = false,
  showTextSymbol = true,
}) => {
  const { t } = useTranslation();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center py-1.5 px-2 sm:py-3 sm:px-4 bg-slate-900/80 rounded-xl sm:rounded-2xl border border-slate-800 backdrop-blur shadow-inner select-none">
      {/* LED Signal Indicator & Oscilloscope Waves */}
      <div className="flex items-center gap-2.5 sm:gap-6 mb-0.5 sm:mb-1.5">
        {/* Visual LED Flasher */}
        <div className="flex flex-col items-center gap-0.5">
          <div
            className={`w-7 h-7 sm:w-11 sm:h-11 rounded-full transition-all duration-75 flex items-center justify-center border-2 ${
              isActive
                ? 'bg-amber-400 border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.9)] scale-105'
                : 'bg-slate-800 border-slate-700 shadow-none scale-100 opacity-60'
            }`}
          >
            <div
              className={`w-2.5 h-2.5 sm:w-4.5 sm:h-4.5 rounded-full ${
                isActive ? 'bg-amber-100 animate-pulse' : 'bg-slate-700'
              }`}
            />
          </div>
          <span className="text-[7px] sm:text-[9px] font-mono tracking-wider text-slate-400 uppercase">
            {isActive ? t.visualizer.signalOn : t.visualizer.signalOff}
          </span>
        </div>

        {/* Animated Sound / Pulse Bars */}
        <div className="flex items-end gap-0.5 sm:gap-1.5 h-6 sm:h-9 px-1.5 sm:px-2.5 py-0.5 sm:py-1 bg-slate-950/60 rounded-lg sm:rounded-xl border border-slate-800">
          {[40, 75, 100, 60, 90, 45, 80, 55].map((height, idx) => (
            <div
              key={idx}
              className={`w-1 sm:w-1.5 rounded-full transition-all duration-75 ${
                isActive
                  ? 'bg-gradient-to-t from-cyan-500 to-amber-300'
                  : 'bg-slate-800'
              }`}
              style={{
                height: isActive ? `${height}%` : '15%',
              }}
            />
          ))}
        </div>
      </div>

      {/* Symbol Display (Fixed height container to prevent vertical layout shifts) */}
      {showTextSymbol && (
        <div className="w-full max-w-xs h-6 sm:h-8 my-0.5 flex items-center justify-center">
          <div
            className={`font-mono text-xs sm:text-lg tracking-[0.2em] font-bold px-2 sm:px-3 py-0.5 rounded-md sm:rounded-lg border transition-all duration-100 text-center w-full truncate ${
              symbolText
                ? 'text-cyan-400 bg-slate-950/80 border-slate-800 shadow-inner'
                : 'text-slate-700 bg-slate-950/30 border-transparent'
            }`}
          >
            {symbolText || '•••••'}
          </div>
        </div>
      )}

      {/* Mode & Symbol Status Badge */}
      <div className="h-4 sm:h-5 mt-0.5 flex items-center justify-center gap-1.5 sm:gap-2 text-[9px] sm:text-[11px] font-medium">
        {isVisualOnly ? (
          <span className="inline-flex items-center gap-0.5 text-amber-400 bg-amber-950/40 px-1.5 py-0.2 rounded-full border border-amber-800/50">
            <Eye size={10} />
            {t.visualizer.visualMode}
          </span>
        ) : (
          <span className="inline-flex items-center gap-0.5 text-emerald-400 bg-emerald-950/40 px-1.5 py-0.2 rounded-full border border-emerald-800/50">
            <Volume2 size={10} />
            {t.visualizer.audioMode}
          </span>
        )}

        {/* Current symbol badge */}
        <span
          className={`font-mono font-bold px-1 py-0.2 rounded border transition-opacity duration-75 ${
            currentSymbol
              ? 'opacity-100 text-cyan-300 bg-cyan-950/60 border-cyan-800/60'
              : 'opacity-0 pointer-events-none text-transparent bg-transparent border-transparent'
          }`}
        >
          {currentSymbol === '.' ? t.visualizer.dot : t.visualizer.dash}
        </span>
      </div>
    </div>
  );
};
