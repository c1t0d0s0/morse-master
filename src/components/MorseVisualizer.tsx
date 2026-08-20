import React from 'react';
import { Volume2, Eye } from 'lucide-react';

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
  return (
    <div className="w-full flex flex-col items-center justify-center p-4 bg-slate-900/80 rounded-2xl border border-slate-800 backdrop-blur shadow-inner select-none">
      {/* LED Signal Indicator & Oscilloscope Waves */}
      <div className="flex items-center gap-6 mb-2">
        {/* Visual LED Flasher */}
        <div className="flex flex-col items-center gap-1">
          <div
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-all duration-75 flex items-center justify-center border-2 ${
              isActive
                ? 'bg-amber-400 border-amber-300 shadow-[0_0_35px_rgba(251,191,36,0.9)] scale-110'
                : 'bg-slate-800 border-slate-700 shadow-none scale-100 opacity-60'
            }`}
          >
            <div
              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full ${
                isActive ? 'bg-amber-100 animate-pulse' : 'bg-slate-700'
              }`}
            />
          </div>
          <span className="text-[9px] sm:text-[10px] font-mono tracking-wider text-slate-400 uppercase">
            {isActive ? 'SIGNAL ON' : 'SIGNAL OFF'}
          </span>
        </div>

        {/* Animated Sound / Pulse Bars */}
        <div className="flex items-end gap-1.5 h-11 sm:h-12 px-3 py-1 bg-slate-950/60 rounded-xl border border-slate-800">
          {[40, 75, 100, 60, 90, 45, 80, 55].map((height, idx) => (
            <div
              key={idx}
              className={`w-1.5 rounded-full transition-all duration-75 ${
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
        <div className="w-full max-w-xs h-11 my-1 flex items-center justify-center">
          <div
            className={`font-mono text-xl sm:text-2xl tracking-[0.3em] font-bold px-4 py-1 rounded-lg border transition-all duration-100 text-center w-full truncate ${
              symbolText
                ? 'text-cyan-400 bg-slate-950/80 border-slate-800 shadow-inner'
                : 'text-slate-700 bg-slate-950/30 border-transparent'
            }`}
          >
            {symbolText || '•••••'}
          </div>
        </div>
      )}

      {/* Mode & Symbol Status Badge (Fixed height to prevent shaking) */}
      <div className="h-7 mt-1 flex items-center justify-center gap-2 text-xs font-medium">
        {isVisualOnly ? (
          <span className="inline-flex items-center gap-1 text-amber-400 bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-800/50">
            <Eye size={13} />
            視覚モード
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-800/50">
            <Volume2 size={13} />
            音・視覚連動
          </span>
        )}

        {/* Fixed slot for current symbol so width/height never jumps */}
        <span
          className={`font-mono font-bold px-2 py-0.5 rounded border transition-opacity duration-75 ${
            currentSymbol
              ? 'opacity-100 text-cyan-300 bg-cyan-950/60 border-cyan-800/60'
              : 'opacity-0 pointer-events-none text-transparent bg-transparent border-transparent'
          }`}
        >
          {currentSymbol === '.' ? '短点 (・)' : '長点 (－)'}
        </span>
      </div>
    </div>
  );
};
