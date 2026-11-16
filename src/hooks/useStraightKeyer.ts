import React, { useCallback, useEffect, useRef, useState } from 'react';
import { morseAudio } from '../audio/morseAudioEngine';
import type { PaddleSymbol } from './paddleRepeater';

interface UseStraightKeyerOptions {
  /** キーを離したときに、押下時間から判定した符号で呼ばれる */
  onSymbol: (symbol: PaddleSymbol) => void;
  wpm?: number;
}

/**
 * 電鍵（ストレートキー）入力のフック。
 * 押している間トーンを鳴らし、離したときに「押下時間 > 短点×1.8 なら長点」で判定する
 * （FreeKeyer / TappingQuiz と同じ基準）。
 */
export const useStraightKeyer = ({ onSymbol, wpm }: UseStraightKeyerOptions) => {
  const onSymbolRef = useRef(onSymbol);
  onSymbolRef.current = onSymbol;
  const wpmRef = useRef(wpm);
  wpmRef.current = wpm;

  const downAtRef = useRef<number | null>(null);
  const [isDown, setIsDown] = useState(false);

  const down = useCallback(() => {
    if (downAtRef.current !== null) return;
    downAtRef.current = Date.now();
    setIsDown(true);
    morseAudio.startManualTone();
  }, []);

  const up = useCallback(() => {
    if (downAtRef.current === null) return;
    const duration = Date.now() - downAtRef.current;
    downAtRef.current = null;
    setIsDown(false);
    morseAudio.stopManualTone();

    const dot = morseAudio.getDotDurationMs(wpmRef.current);
    onSymbolRef.current(duration > dot * 1.8 ? '-' : '.');
  }, []);

  /** 判定せずに離した扱いにする（モード切替・フォーカス喪失時など） */
  const cancel = useCallback(() => {
    if (downAtRef.current === null) return;
    downAtRef.current = null;
    setIsDown(false);
    morseAudio.stopManualTone();
  }, []);

  useEffect(() => {
    window.addEventListener('blur', cancel);
    return () => {
      window.removeEventListener('blur', cancel);
      cancel();
    };
  }, [cancel]);

  const pointerHandlers = {
    onPointerDown: (e: React.PointerEvent<HTMLElement>) => {
      if (e.button !== 0) return;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      down();
    },
    onPointerUp: up,
    onPointerCancel: cancel,
    onLostPointerCapture: up,
  };

  return { isDown, down, up, cancel, pointerHandlers };
};
