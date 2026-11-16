import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Gamepad2, Heart, Trophy, Gauge, Timer, Play, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { morseAudio } from '../audio/morseAudioEngine';
import { AudioEngineSettings, KeyingMode } from '../types';
import { useTranslation } from '../i18n/LanguageContext';
import { usePaddleKeyer } from '../hooks/usePaddleKeyer';
import { useStraightKeyer } from '../hooks/useStraightKeyer';
import { PaddleSymbol } from '../hooks/paddleRepeater';
import { preventTouchSelection } from '../utils/preventTouchSelection';
import {
  GameState,
  createGame,
  startGame,
  step,
  fire,
  getLevel,
  INITIAL_LIVES,
  SHOT_MS,
  EFFECT_MS,
} from '../game/morseCannonGame';

interface MorseGameProps {
  settings: AudioEngineSettings;
}

type Difficulty = 'beginner' | 'advanced';

const HIGH_SCORE_KEY = (d: Difficulty) => `morse-master:game:highScore:${d}`;

const loadHighScore = (d: Difficulty): number => {
  try {
    const v = Number(localStorage.getItem(HIGH_SCORE_KEY(d)));
    return Number.isFinite(v) && v > 0 ? v : 0;
  } catch {
    return 0;
  }
};

const saveHighScore = (d: Difficulty, score: number) => {
  try {
    localStorage.setItem(HIGH_SCORE_KEY(d), String(score));
  } catch {
    // ストレージが使えない環境ではその場限り
  }
};

// ---- フィールド（SVG）の寸法 ----
const W = 360;
const H = 460;
const CARD_W = 72;
const CANNON_LINE = 392; // カードがここまで落ちたら失点
const PIVOT = { x: W / 2, y: 428 };
const BARREL_LEN = 44;

const cardHeight = (showCode: boolean) => (showCode ? 88 : 72);
const cardTop = (y: number, showCode: boolean) => 8 + y * (CANNON_LINE - 8 - cardHeight(showCode));
const cardCenter = (x: number, y: number, showCode: boolean) => ({
  cx: x * W,
  cy: cardTop(y, showCode) + cardHeight(showCode) / 2,
});

const symbolGlyph = (s: string) => (s === '.' ? '・' : '－');

const formatTime = (ms: number) => {
  const total = Math.floor(ms / 1000);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
};

export const MorseGame: React.FC<MorseGameProps> = ({ settings }) => {
  const { t } = useTranslation();
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [keyingMode, setKeyingMode] = useState<KeyingMode>('paddle');
  const [game, setGame] = useState<GameState>(createGame);
  const gameRef = useRef<GameState>(game);

  const [highScores, setHighScores] = useState<Record<Difficulty, number>>(() => ({
    beginner: loadHighScore('beginner'),
    advanced: loadHighScore('advanced'),
  }));
  const highScoresRef = useRef(highScores);
  highScoresRef.current = highScores;
  const [isNewRecord, setIsNewRecord] = useState(false);

  // 入力中の符号
  const [buffer, setBuffer] = useState('');
  const bufferRef = useRef('');
  const idleTimerRef = useRef<number | null>(null);

  // 演出
  const [missAt, setMissAt] = useState<number | null>(null);
  const [speedUpAt, setSpeedUpAt] = useState<number | null>(null);

  const difficultyRef = useRef(difficulty);
  difficultyRef.current = difficulty;
  const showCode = difficulty === 'beginner';
  const isPlaying = game.phase === 'playing';

  const commitGame = (next: GameState) => {
    gameRef.current = next;
    setGame(next);
  };

  const clearBuffer = useCallback(() => {
    bufferRef.current = '';
    setBuffer('');
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  const miss = useCallback(() => {
    clearBuffer();
    setMissAt(Date.now());
  }, [clearBuffer]);

  const handleGameOver = (score: number) => {
    const d = difficultyRef.current;
    if (score <= highScoresRef.current[d]) return;
    saveHighScore(d, score);
    setHighScores(prev => ({ ...prev, [d]: score }));
    setIsNewRecord(true);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  };

  // ---- ゲームループ ----
  useEffect(() => {
    let rafId = 0;
    let last: number | null = null;

    const loop = (now: number) => {
      rafId = requestAnimationFrame(loop);
      if (document.hidden) {
        last = null;
        return;
      }
      // タブ復帰などで dt が大きくなりすぎないようにする
      const dt = last === null ? 0 : Math.min(now - last, 50);
      last = now;

      const prev = gameRef.current;
      if (prev.phase !== 'playing' && prev.effects.length === 0) return;

      const next = step(prev, dt);
      if (next.card?.id !== prev.card?.id) clearBuffer();
      if (getLevel(next.elapsedMs) > getLevel(prev.elapsedMs)) setSpeedUpAt(Date.now());
      if (prev.phase === 'playing' && next.phase === 'over') handleGameOver(next.score);
      commitGame(next);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 演出の自動消去
  useEffect(() => {
    if (missAt === null) return;
    const id = setTimeout(() => setMissAt(null), 500);
    return () => clearTimeout(id);
  }, [missAt]);

  useEffect(() => {
    if (speedUpAt === null) return;
    const id = setTimeout(() => setSpeedUpAt(null), 1500);
    return () => clearTimeout(id);
  }, [speedUpAt]);

  useEffect(() => () => clearBuffer(), [clearBuffer]);

  const handleStart = () => {
    clearBuffer();
    setIsNewRecord(false);
    setMissAt(null);
    setSpeedUpAt(null);
    commitGame(startGame());
  };

  // ---- 入力判定 ----
  // fromPaddle: パドルは符号の送出開始時に呼ばれるので、無音判定を符号長ぶん延ばす
  const handleSymbol = (sym: PaddleSymbol, fromPaddle: boolean) => {
    const g = gameRef.current;
    if (g.phase !== 'playing' || !g.card || g.shot) return;

    const next = bufferRef.current + sym;
    if (next === g.card.code) {
      clearBuffer();
      commitGame(fire(g));
      return;
    }
    if (!g.card.code.startsWith(next)) {
      miss();
      return;
    }

    bufferRef.current = next;
    setBuffer(next);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    const dot = morseAudio.getDotDurationMs(settings.wpm);
    idleTimerRef.current = window.setTimeout(() => {
      idleTimerRef.current = null;
      if (bufferRef.current) miss();
    }, dot * (fromPaddle && sym === '-' ? 5.5 : 3.5));
  };

  const paddle = usePaddleKeyer({
    onSymbol: sym => {
      morseAudio.playSymbol(sym, settings.wpm);
      handleSymbol(sym, true);
    },
    wpm: settings.wpm,
  });

  const straight = useStraightKeyer({
    onSymbol: sym => handleSymbol(sym, false),
    wpm: settings.wpm,
  });

  useEffect(() => {
    paddle.releaseAll();
    straight.cancel();
  }, [keyingMode, paddle.releaseAll, straight.cancel]);

  // ---- キーボード ----
  const handleStartRef = useRef(handleStart);
  handleStartRef.current = handleStart;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;
      const playing = gameRef.current.phase === 'playing';

      if (!playing) {
        if ((e.key === 'Enter' || e.code === 'Space') && !e.repeat) {
          e.preventDefault();
          handleStartRef.current();
        }
        return;
      }

      if (keyingMode === 'paddle') {
        if (e.key === 'j' || e.key === 'J') {
          e.preventDefault();
          if (!e.repeat) paddle.press('.');
        } else if (e.key === 'k' || e.key === 'K') {
          e.preventDefault();
          if (!e.repeat) paddle.press('-');
        }
      } else if (e.code === 'Space') {
        e.preventDefault();
        if (!e.repeat) straight.down();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (keyingMode === 'paddle') {
        if (e.key === 'j' || e.key === 'J') paddle.release('.');
        else if (e.key === 'k' || e.key === 'K') paddle.release('-');
      } else if (e.code === 'Space') {
        e.preventDefault();
        straight.up();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [keyingMode, paddle.press, paddle.release, straight.down, straight.up]);

  // ---- 描画 ----
  const level = getLevel(game.elapsedMs);
  const card = game.card;
  const center = card ? cardCenter(card.x, card.y, showCode) : { cx: W / 2, cy: 0 };
  const angleDeg = card
    ? (Math.atan2(center.cx - PIVOT.x, PIVOT.y - center.cy) * 180) / Math.PI
    : 0;
  const angleRad = (angleDeg * Math.PI) / 180;
  const muzzle = {
    x: PIVOT.x + Math.sin(angleRad) * BARREL_LEN,
    y: PIVOT.y - Math.cos(angleRad) * BARREL_LEN,
  };

  const renderSegmentedButton = <T extends string>(
    value: T,
    current: T,
    label: string,
    onClick: (v: T) => void,
    activeClass: string,
  ) => (
    <button
      key={value}
      onClick={() => onClick(value)}
      disabled={isPlaying}
      title={isPlaying ? t.game.lockedDuringPlay : undefined}
      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition disabled:cursor-not-allowed ${
        current === value ? activeClass : 'text-slate-400 hover:text-slate-200 disabled:hover:text-slate-400'
      }`}
    >
      {label}
    </button>
  );

  const renderCard = () => {
    if (!card) return null;
    const top = cardTop(card.y, showCode);
    const h = cardHeight(showCode);
    const left = center.cx - CARD_W / 2;
    const targeted = Boolean(game.shot);
    return (
      <g>
        <rect
          x={left}
          y={top}
          width={CARD_W}
          height={h}
          rx={10}
          fill={targeted ? '#fef3c7' : '#f8fafc'}
          stroke={targeted ? '#f59e0b' : '#94a3b8'}
          strokeWidth={2}
        />
        <text
          x={center.cx}
          y={top + 50}
          textAnchor="middle"
          fontSize={42}
          fontWeight={900}
          fill="#0f172a"
        >
          {card.char}
        </text>
        {showCode && (
          <text x={center.cx} y={top + 76} textAnchor="middle" fontSize={14} fontWeight={700} letterSpacing={1}>
            {Array.from(card.code).map((s, i) => (
              <tspan key={i} fill={i < buffer.length ? '#0891b2' : '#475569'}>
                {symbolGlyph(s)}
              </tspan>
            ))}
          </text>
        )}
      </g>
    );
  };

  const renderShot = () => {
    if (!game.shot || !card) return null;
    const p = Math.min(game.shot.elapsedMs / SHOT_MS, 1);
    const x = muzzle.x + (center.cx - muzzle.x) * p;
    const y = muzzle.y + (center.cy - muzzle.y) * p;
    return (
      <g>
        <line x1={muzzle.x} y1={muzzle.y} x2={x} y2={y} stroke="#fbbf24" strokeOpacity={0.35} strokeWidth={4} strokeLinecap="round" />
        <circle cx={x} cy={y} r={7} fill="#fde047" filter="url(#game-glow)" />
      </g>
    );
  };

  const renderEffects = () =>
    game.effects.map(e => {
      const k = e.ageMs / EFFECT_MS;
      if (e.kind === 'hit') {
        const { cx, cy } = cardCenter(e.x, e.y, showCode);
        return (
          <g key={e.id} opacity={1 - k}>
            <circle cx={cx} cy={cy} r={12 + k * 36} fill="none" stroke="#fbbf24" strokeWidth={4} />
            <circle cx={cx} cy={cy} r={8 + k * 18} fill="#f97316" opacity={0.6} />
            <text x={cx} y={cy - 20 - k * 30} textAnchor="middle" fontSize={20} fontWeight={900} fill="#fde047">
              +{e.points}
            </text>
          </g>
        );
      }
      const cx = e.x * W;
      return (
        <g key={e.id} opacity={1 - k}>
          <rect x={cx - 40} y={CANNON_LINE - 4} width={80} height={8} rx={4} fill="#f43f5e" />
          <text x={cx} y={CANNON_LINE - 14 - k * 20} textAnchor="middle" fontSize={16} fontWeight={800} fill="#fb7185">
            −1 ♥
          </text>
        </g>
      );
    });

  const renderCannon = () => (
    <g>
      {/* 砲身 */}
      <g transform={`rotate(${angleDeg} ${PIVOT.x} ${PIVOT.y})`}>
        <rect x={PIVOT.x - 9} y={PIVOT.y - BARREL_LEN} width={18} height={BARREL_LEN} rx={4} fill="#64748b" stroke="#cbd5e1" strokeWidth={2} />
        <rect x={PIVOT.x - 11} y={PIVOT.y - BARREL_LEN} width={22} height={7} rx={2} fill="#94a3b8" />
      </g>
      {/* 砲台 */}
      <path d={`M ${PIVOT.x - 34} ${H - 6} L ${PIVOT.x - 22} ${PIVOT.y - 6} L ${PIVOT.x + 22} ${PIVOT.y - 6} L ${PIVOT.x + 34} ${H - 6} Z`} fill="#334155" stroke="#94a3b8" strokeWidth={2} />
      <circle cx={PIVOT.x} cy={PIVOT.y} r={12} fill="#475569" stroke="#cbd5e1" strokeWidth={2} />
    </g>
  );

  const renderOverlay = () => {
    if (game.phase === 'playing') return null;
    const isOver = game.phase === 'over';
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/75 backdrop-blur-sm rounded-2xl p-4 text-center">
        {isOver ? (
          <>
            <div className="text-2xl font-black text-rose-400">{t.game.gameOver}</div>
            <div className="text-xs text-slate-400">{t.game.finalScore}</div>
            <div className="text-4xl font-black text-white tabular-nums">{game.score}</div>
            {isNewRecord && (
              <div className="flex items-center gap-1 text-amber-300 font-bold text-sm animate-pulse">
                <Trophy size={16} />
                {t.game.newRecord}
              </div>
            )}
          </>
        ) : (
          <>
            <Gamepad2 size={36} className="text-cyan-400" />
            <div className="text-xl font-black text-white">{t.game.title}</div>
            <p className="text-xs text-slate-300 max-w-[260px] leading-relaxed">{t.game.howTo}</p>
            <div className="text-[11px] text-cyan-300">
              {showCode ? t.game.beginnerDesc : t.game.advancedDesc}
            </div>
          </>
        )}
        <button
          onClick={handleStart}
          className="mt-1 flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-lg shadow-cyan-500/20 hover:brightness-110 transition"
        >
          {isOver ? <RotateCcw size={16} /> : <Play size={16} />}
          {isOver ? t.game.retry : t.game.start}
        </button>
        <div className="text-[10px] font-mono text-slate-500 hidden sm:block">
          {keyingMode === 'paddle' ? t.game.startHintPaddle : t.game.startHintStraight}
        </div>
      </div>
    );
  };

  const renderKeyingController = () =>
    keyingMode === 'paddle' ? (
      <div ref={preventTouchSelection} className="keyer-surface grid grid-cols-2 gap-3" onContextMenu={e => e.preventDefault()}>
        <button
          type="button"
          {...paddle.getPointerHandlers('.')}
          className={`h-16 sm:h-20 text-slate-100 rounded-2xl border-2 shadow-xl flex flex-col items-center justify-center gap-0.5 transition-all select-none touch-manipulation cursor-pointer ${
            paddle.heldSymbol === '.'
              ? 'bg-gradient-to-b from-cyan-600 to-cyan-700 border-cyan-400 scale-95'
              : 'bg-gradient-to-b from-slate-800 to-slate-900 border-slate-700'
          }`}
        >
          <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.9)]" />
          <span className="text-base font-black">{t.freeKeyer.dotButton}</span>
          <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">{t.freeKeyer.keyJ}</span>
        </button>
        <button
          type="button"
          {...paddle.getPointerHandlers('-')}
          className={`h-16 sm:h-20 text-slate-100 rounded-2xl border-2 shadow-xl flex flex-col items-center justify-center gap-0.5 transition-all select-none touch-manipulation cursor-pointer ${
            paddle.heldSymbol === '-'
              ? 'bg-gradient-to-b from-blue-600 to-blue-700 border-blue-400 scale-95'
              : 'bg-gradient-to-b from-slate-800 to-slate-900 border-slate-700'
          }`}
        >
          <div className="w-10 h-3 rounded-full bg-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.9)]" />
          <span className="text-base font-black">{t.freeKeyer.dashButton}</span>
          <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">{t.freeKeyer.keyK}</span>
        </button>
      </div>
    ) : (
      <div ref={preventTouchSelection} className="keyer-surface" onContextMenu={e => e.preventDefault()}>
        <button
          type="button"
          {...straight.pointerHandlers}
          className={`w-full h-16 sm:h-20 rounded-2xl border-2 shadow-xl flex flex-col items-center justify-center gap-0.5 transition-all select-none touch-manipulation cursor-pointer ${
            straight.isDown
              ? 'bg-amber-500 border-amber-300 scale-95 shadow-[0_0_25px_rgba(245,158,11,0.9)]'
              : 'bg-gradient-to-b from-slate-800 to-slate-900 border-slate-700'
          }`}
        >
          <div className={`w-6 h-6 rounded-full border-2 ${straight.isDown ? 'bg-white border-amber-200' : 'bg-slate-700 border-slate-600'}`} />
          <span className="text-base font-black text-white">
            {straight.isDown ? t.freeKeyer.transmitting : t.freeKeyer.straightIdle}
          </span>
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">{t.freeKeyer.pcKeyHelp}</span>
        </button>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto space-y-2.5 sm:space-y-4">
      {/* Header */}
      <div className="bg-slate-900/90 p-3 sm:p-4 rounded-2xl border border-slate-800 backdrop-blur shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
            <Gamepad2 size={20} className="text-cyan-400" />
            {t.game.title}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">{t.game.subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-950/60 p-0.5 rounded-xl border border-slate-800">
            {renderSegmentedButton<Difficulty>('beginner', difficulty, t.game.modeBeginner, setDifficulty, 'bg-cyan-500 text-slate-950 font-bold')}
            {renderSegmentedButton<Difficulty>('advanced', difficulty, t.game.modeAdvanced, setDifficulty, 'bg-cyan-500 text-slate-950 font-bold')}
          </div>
          <div className="flex items-center gap-1 bg-slate-950/60 p-0.5 rounded-xl border border-slate-800">
            {renderSegmentedButton<KeyingMode>('paddle', keyingMode, t.freeKeyer.modePaddle, setKeyingMode, 'bg-blue-600 text-white font-bold')}
            {renderSegmentedButton<KeyingMode>('straight', keyingMode, t.freeKeyer.modeStraight, setKeyingMode, 'bg-blue-600 text-white font-bold')}
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-3 sm:p-5 backdrop-blur shadow-2xl space-y-2.5 sm:space-y-3">
        {/* Status */}
        <div className="grid grid-cols-4 gap-1.5 text-center">
          <div className="bg-slate-950/70 rounded-xl border border-slate-800 py-1">
            <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-500">{t.game.score}</div>
            <div className="text-base sm:text-lg font-black text-white tabular-nums">{game.score}</div>
          </div>
          <div className="bg-slate-950/70 rounded-xl border border-slate-800 py-1">
            <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-500 flex items-center justify-center gap-0.5">
              <Trophy size={10} className="text-amber-400" />
              {t.game.highScore}
            </div>
            <div className="text-base sm:text-lg font-black text-amber-300 tabular-nums">{highScores[difficulty]}</div>
          </div>
          <div className="bg-slate-950/70 rounded-xl border border-slate-800 py-1">
            <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-500">{t.game.lives}</div>
            <div className="flex items-center justify-center gap-0.5 h-6 sm:h-7" aria-label={`${t.game.lives}: ${game.lives}`}>
              {Array.from({ length: INITIAL_LIVES }, (_, i) => (
                <Heart
                  key={i}
                  size={15}
                  className={i < game.lives ? 'text-rose-500 fill-rose-500' : 'text-slate-700'}
                />
              ))}
            </div>
          </div>
          <div className="bg-slate-950/70 rounded-xl border border-slate-800 py-1">
            <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-500 flex items-center justify-center gap-0.5">
              <Gauge size={10} />
              {t.game.level} {level + 1}
            </div>
            <div className="text-base sm:text-lg font-black text-cyan-300 tabular-nums flex items-center justify-center gap-0.5">
              <Timer size={12} className="text-slate-500" />
              {formatTime(game.elapsedMs)}
            </div>
          </div>
        </div>

        {/* Field */}
        <div
          className="relative mx-auto max-w-full"
          style={{ height: 'min(50dvh, 460px)', aspectRatio: `${W} / ${H}` }}
        >
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full select-none" role="img" aria-label={t.game.title}>
            <defs>
              <linearGradient id="game-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0b1024" />
                <stop offset="100%" stopColor="#1b1f4b" />
              </linearGradient>
              <filter id="game-glow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <rect x={0} y={0} width={W} height={H} rx={16} fill="url(#game-sky)" />
            {/* 防衛ライン */}
            <line x1={10} y1={CANNON_LINE} x2={W - 10} y2={CANNON_LINE} stroke="#f43f5e" strokeOpacity={0.35} strokeWidth={2} strokeDasharray="6 6" />

            {renderCard()}
            {renderShot()}
            {renderCannon()}
            {renderEffects()}

            {/* 空振り */}
            {missAt !== null && (
              <text x={PIVOT.x + 52} y={PIVOT.y + 6} fontSize={30} fontWeight={900} fill="#f43f5e">
                {t.game.miss}
              </text>
            )}

            {/* スピードアップ */}
            {speedUpAt !== null && isPlaying && (
              <text x={W / 2} y={H / 2} textAnchor="middle" fontSize={30} fontWeight={900} fill="#fde047" filter="url(#game-glow)">
                {t.game.speedUp}
              </text>
            )}
          </svg>
          {renderOverlay()}
        </div>

        {/* 入力中の符号 */}
        <div className="h-7 flex items-center justify-center">
          <div
            className={`font-mono text-lg font-bold tracking-[0.25em] px-3 rounded-lg border min-w-[6rem] text-center ${
              buffer ? 'text-cyan-300 bg-slate-950/80 border-slate-700' : 'text-slate-700 bg-slate-950/30 border-transparent'
            }`}
          >
            {buffer ? Array.from(buffer).map(symbolGlyph).join('') : '・－'}
          </div>
        </div>

        {/* Keying Controller */}
        {renderKeyingController()}
      </div>
    </div>
  );
};
