import React, { useCallback, useEffect, useRef, useState } from 'react';
import { morseAudio } from '../audio/morseAudioEngine';
import { PaddleRepeater, PaddleSymbol, PaddleRepeaterOptions } from './paddleRepeater';

export type { PaddleSymbol };

interface UsePaddleKeyerOptions {
  /** 符号を1つ送出するときに呼ばれる（音・表示・バッファ追加は呼び出し側で行う） */
  onSymbol: (symbol: PaddleSymbol) => void;
  /** 送出速度 */
  wpm?: number;
}

/**
 * パドル入力の連続打鍵フック。押し続けると同じ符号をモールスのタイミングで繰り返す。
 * スケジューリングは PaddleRepeater（./paddleRepeater.ts）が行う。
 */
export const usePaddleKeyer = ({ onSymbol, wpm }: UsePaddleKeyerOptions) => {
  const [heldSymbol, setHeldSymbol] = useState<PaddleSymbol | null>(null);

  // 毎レンダーの最新の onSymbol / wpm を使う（タイマーから古いクロージャを呼ばない）
  const options: PaddleRepeaterOptions = {
    onSymbol,
    getDotMs: () => morseAudio.getDotDurationMs(wpm),
    onHeldChange: setHeldSymbol,
  };
  const repeaterRef = useRef<PaddleRepeater | null>(null);
  if (repeaterRef.current === null) {
    repeaterRef.current = new PaddleRepeater(options);
  }
  repeaterRef.current.setOptions(options);

  const press = useCallback((symbol: PaddleSymbol) => repeaterRef.current?.press(symbol), []);
  const release = useCallback((symbol: PaddleSymbol) => repeaterRef.current?.release(symbol), []);
  const releaseAll = useCallback(() => repeaterRef.current?.releaseAll(), []);

  useEffect(() => {
    // ウィンドウがフォーカスを失うと keyup が届かないので押しっぱなしを解除
    window.addEventListener('blur', releaseAll);
    return () => {
      window.removeEventListener('blur', releaseAll);
      repeaterRef.current?.dispose();
    };
  }, [releaseAll]);

  /** パドルボタンに渡すポインタイベント（クリック/タッチの長押しで連続打鍵） */
  const getPointerHandlers = useCallback((symbol: PaddleSymbol) => ({
    onPointerDown: (e: React.PointerEvent<HTMLElement>) => {
      if (e.button !== 0) return;
      // ボタン外に指がずれても、離すまで押下扱いにする
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      press(symbol);
    },
    onPointerUp: () => release(symbol),
    onPointerCancel: () => release(symbol),
    onLostPointerCapture: () => release(symbol),
  }), [press, release]);

  return { press, release, releaseAll, heldSymbol, getPointerHandlers };
};
