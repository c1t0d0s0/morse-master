import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, Delete, CornerDownLeft, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TargetCharset, DifficultyLevel, AudioEngineSettings, KeyingMode } from '../types';
import { getRandomQuizItem, QuizWord } from '../data/wordLists';
import { textToMorse, morseToDotsAndDashes, morseToText } from '../data/morseData';
import { morseAudio } from '../audio/morseAudioEngine';
import { MorseVisualizer } from './MorseVisualizer';
import { useTranslation } from '../i18n/LanguageContext';

interface TappingQuizProps {
  settings: AudioEngineSettings;
}

export const TappingQuiz: React.FC<TappingQuizProps> = ({ settings }) => {
  const { language, t } = useTranslation();
  const [charset, setCharset] = useState<TargetCharset>('alphabet');
  const [level, setLevel] = useState<DifficultyLevel>('beginner');
  const [keyingMode, setKeyingMode] = useState<KeyingMode>('paddle');
  const [currentWord, setCurrentWord] = useState<QuizWord | null>(null);
  
  // 入力中の文字の短長点バッファ (例: ".-")
  const [currentCharBuffer, setCurrentCharBuffer] = useState<string>('');
  // 確定済みの文字配列 (例: ["A", "B"])
  const [committedChars, setCommittedChars] = useState<string[]>([]);
  // 確定済みの符号配列 (例: [".-", "-..."])
  const [committedCodes, setCommittedCodes] = useState<string[]>([]);

  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [activeSignal, setActiveSignal] = useState<boolean>(false);
  const [currentSymbol, setCurrentSymbol] = useState<'.' | '-' | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [score, setScore] = useState<number>(0);

  // ストレートキー用
  const straightKeyDownTimeRef = useRef<number | null>(null);

  // 新規問題
  const nextQuestion = (newCharset = charset, newLevel = level) => {
    morseAudio.stopPlayback();
    const question = getRandomQuizItem(newCharset, newLevel);
    setCurrentWord(question);
    setCurrentCharBuffer('');
    setCommittedChars([]);
    setCommittedCodes([]);
    setIsAnswered(false);
    setIsCorrect(false);
    setShowHint(false);
    setActiveSignal(false);
    setCurrentSymbol(null);
  };

  useEffect(() => {
    nextQuestion(charset, level);
  }, [charset, level]);

  // 短点・長点の入力
  const handleInputSymbol = async (sym: '.' | '-') => {
    if (isAnswered) return;
    setCurrentSymbol(sym);
    setActiveSignal(true);

    // 音声＆振動再生
    morseAudio.playSymbol(sym);
    setTimeout(() => {
      setActiveSignal(false);
      setCurrentSymbol(null);
    }, sym === '.' ? morseAudio.getDotDurationMs() : morseAudio.getDotDurationMs() * 3);

    const nextBuffer = currentCharBuffer + sym;
    setCurrentCharBuffer(nextBuffer);
  };

  // 現在の文字バッファを確定
  const commitCurrentChar = () => {
    if (!currentCharBuffer) return;
    const isWabun = currentWord?.category === 'wabun';
    const decodedChar = morseToText(currentCharBuffer, isWabun);

    setCommittedChars(prev => [...prev, decodedChar]);
    setCommittedCodes(prev => [...prev, currentCharBuffer]);
    setCurrentCharBuffer('');
  };

  // 1文字削除 (Backspace)
  const handleBackspace = () => {
    if (currentCharBuffer.length > 0) {
      setCurrentCharBuffer(prev => prev.slice(0, -1));
    } else if (committedChars.length > 0) {
      setCommittedChars(prev => prev.slice(0, -1));
      setCommittedCodes(prev => prev.slice(0, -1));
    }
  };

  // 全クリア
  const handleClear = () => {
    setCurrentCharBuffer('');
    setCommittedChars([]);
    setCommittedCodes([]);
  };

  // ストレートキー押下開始
  const handleStraightKeyDown = () => {
    if (isAnswered || straightKeyDownTimeRef.current !== null) return;
    straightKeyDownTimeRef.current = Date.now();
    setActiveSignal(true);
    morseAudio.startManualTone();
  };

  // ストレートキー押下終了
  const handleStraightKeyUp = () => {
    if (straightKeyDownTimeRef.current === null) return;
    const duration = Date.now() - straightKeyDownTimeRef.current;
    straightKeyDownTimeRef.current = null;
    setActiveSignal(false);
    morseAudio.stopManualTone();

    // 閾値判定: 短点の基準時間の1.8倍より長ければ長点
    const dotDuration = morseAudio.getDotDurationMs(settings.wpm);
    const symbol: '.' | '-' = duration > dotDuration * 1.8 ? '-' : '.';
    handleInputSymbol(symbol);
  };

  // キーボードショートカット
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (keyingMode === 'paddle') {
        if (e.key === 'j' || e.key === 'J' || e.key === 'f' || e.key === 'F') {
          e.preventDefault();
          handleInputSymbol('.');
        } else if (e.key === 'k' || e.key === 'K' || e.key === 'd' || e.key === 'D') {
          e.preventDefault();
          handleInputSymbol('-');
        } else if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          if (currentCharBuffer) {
            commitCurrentChar();
          } else if (isAnswered) {
            nextQuestion();
          } else {
            handleSubmit();
          }
        } else if (e.key === 'Backspace') {
          e.preventDefault();
          handleBackspace();
        }
      } else {
        // straight key mode
        if (e.code === 'Space' && !e.repeat) {
          e.preventDefault();
          handleStraightKeyDown();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (keyingMode === 'straight' && e.code === 'Space') {
        e.preventDefault();
        handleStraightKeyUp();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [keyingMode, currentCharBuffer, committedChars, isAnswered, currentWord]);

  // 回答判定
  const handleSubmit = () => {
    if (!currentWord || isAnswered) return;

    let finalChars = [...committedChars];
    let finalCodes = [...committedCodes];
    if (currentCharBuffer) {
      const isWabun = currentWord.category === 'wabun';
      const lastDecoded = morseToText(currentCharBuffer, isWabun);
      finalChars.push(lastDecoded);
      finalCodes.push(currentCharBuffer);
      setCommittedChars(finalChars);
      setCommittedCodes(finalCodes);
      setCurrentCharBuffer('');
    }

    const userInputStr = finalChars.join('').toUpperCase();
    const userMorseStr = finalCodes.join(' ');
    const targetText = currentWord.text.toUpperCase();
    const targetMorse = textToMorse(currentWord.text, currentWord.category === 'wabun').code;

    const isMatched = userInputStr === targetText || userMorseStr === targetMorse;

    setIsCorrect(isMatched);
    setIsAnswered(true);

    if (isMatched) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setScore(prev => prev + 10 * (level === 'advanced' ? 3 : level === 'intermediate' ? 2 : 1));

      if (newStreak % 3 === 0) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
    } else {
      setStreak(0);
    }
  };

  const targetConverted = currentWord ? textToMorse(currentWord.text, currentWord.category === 'wabun') : null;
  const currentPreviewChar = currentCharBuffer
    ? morseToText(currentCharBuffer, currentWord?.category === 'wabun')
    : '';

  return (
    <div className="max-w-4xl mx-auto space-y-1.5 sm:space-y-4">
      {/* Settings & Filter Header */}
      <div className="bg-slate-900/90 p-2 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-800 backdrop-blur shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2.5">
          {/* Charset selector */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 sm:pb-0">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-400 mr-0.5 sm:mr-1">{t.controls.charset}</span>
            {[
              { id: 'all', label: t.controls.all },
              { id: 'alphabet', label: t.controls.alphabet },
              { id: 'number', label: t.controls.number },
              { id: 'wabun', label: t.controls.wabun },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCharset(tab.id as TargetCharset)}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg text-[11px] sm:text-xs font-semibold transition whitespace-nowrap ${
                  charset === tab.id
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Difficulty Level Selector */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-400 mr-0.5 sm:mr-1">{t.controls.level}</span>
            {[
              { id: 'beginner', label: t.controls.beginner },
              { id: 'intermediate', label: t.controls.intermediate },
              { id: 'advanced', label: t.controls.advanced },
            ].map(l => (
              <button
                key={l.id}
                onClick={() => setLevel(l.id as DifficultyLevel)}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg text-[11px] sm:text-xs font-semibold transition ${
                  level === l.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Keying Mode Toggle (Paddle vs Straight Key) */}
          <div className="flex items-center gap-0.5 bg-slate-950/60 p-0.5 rounded-lg sm:rounded-xl border border-slate-800">
            <button
              onClick={() => setKeyingMode('paddle')}
              className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg text-[11px] sm:text-xs font-semibold transition ${
                keyingMode === 'paddle'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title={t.tapping.paddleTitle}
            >
              {t.controls.paddle}
            </button>
            <button
              onClick={() => setKeyingMode('straight')}
              className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg text-[11px] sm:text-xs font-semibold transition ${
                keyingMode === 'straight'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title={t.tapping.straightTitle}
            >
              {t.controls.straight}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-1.5 pt-1.5 sm:mt-2.5 sm:pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] sm:text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span>{t.controls.score} <strong className="text-cyan-400 font-mono">{score}</strong></span>
            <span>{t.controls.streak} <strong className="text-amber-400 font-mono">{streak}</strong> 🔥</span>
          </div>
          <div className="text-slate-500 text-[10px] sm:text-[11px] hidden sm:block">
            {keyingMode === 'paddle' ? t.tapping.pcKeyPaddle : t.tapping.pcKeyStraight}
          </div>
        </div>
      </div>

      {/* Main Practice Board */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl sm:rounded-3xl p-2.5 sm:p-5 backdrop-blur shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 items-start">
          {/* Top / Left Column: Target & Visualizer (スマホでは横並び2分割で高さ圧縮) */}
          <div className="md:col-span-5 grid grid-cols-2 md:grid-cols-1 gap-2">
            {/* Target Word / Character Prompt */}
            <div className="bg-slate-950/80 rounded-xl sm:rounded-2xl p-2 sm:p-3 border border-slate-800 text-center flex flex-col items-center justify-center min-h-[72px] sm:min-h-0">
              <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-widest text-slate-400 block">
                {t.tapping.target}
              </span>
              <div className="inline-block px-3 py-0.5 sm:px-5 sm:py-1 bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/40 rounded-xl sm:rounded-2xl shadow-md shadow-cyan-500/10 my-0.5">
                <span className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-blue-300 tracking-wider">
                  {currentWord?.text}
                </span>
              </div>
              {currentWord && (
                <div className="text-[10px] sm:text-xs text-slate-400 truncate max-w-full">
                  {language === 'ja' ? currentWord.meaningJa : (currentWord.meaningEn || currentWord.meaningJa)}
                </div>
              )}

              {/* Hint Toggle */}
              <div className="mt-0.5">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] text-amber-400 hover:text-amber-300 bg-amber-950/40 px-2 py-0.2 rounded-full border border-amber-800/60 transition"
                >
                  <HelpCircle size={10} />
                  {showHint ? t.tapping.hideHint : t.tapping.hint}
                </button>
                {showHint && targetConverted && (
                  <div className="mt-0.5 text-[11px] sm:text-xs font-mono text-amber-300 font-bold tracking-widest animate-fadeIn">
                    {morseToDotsAndDashes(targetConverted.code)}
                  </div>
                )}
              </div>
            </div>

            {/* Real-time Visualizer */}
            <MorseVisualizer
              isActive={activeSignal}
              currentSymbol={currentSymbol}
              symbolText={currentCharBuffer ? morseToDotsAndDashes(currentCharBuffer) : undefined}
              isVisualOnly={settings.visualOnly}
              showTextSymbol={true}
            />
          </div>

          {/* Right Column: User Input, Keys, Actions & Results */}
          <div className="md:col-span-7 space-y-2 sm:space-y-2.5">
            {/* User Input Progress Display */}
            <div className="px-2 sm:px-3 py-1 sm:py-2 bg-slate-950/80 rounded-xl sm:rounded-2xl border border-slate-800 h-10 sm:h-14 flex flex-col justify-center items-center overflow-hidden">
              <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto max-w-full no-scrollbar justify-center">
                {/* Committed characters */}
                {committedChars.map((char, idx) => (
                  <div key={idx} className="flex items-center gap-1 bg-slate-900 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-md sm:rounded-lg border border-slate-700 shrink-0">
                    <span className="text-xs sm:text-sm font-bold text-white leading-none">{char}</span>
                    <span className="font-mono text-[9px] sm:text-[10px] text-cyan-400 leading-none">{morseToDotsAndDashes(committedCodes[idx])}</span>
                  </div>
                ))}

                {/* Currently typing character buffer */}
                {currentCharBuffer && (
                  <div className="flex items-center gap-1 bg-cyan-950/60 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-md sm:rounded-lg border-2 border-cyan-400 animate-pulse shrink-0">
                    <span className="text-xs sm:text-sm font-bold text-cyan-300 leading-none">{currentPreviewChar || '?'}</span>
                    <span className="font-mono text-[9px] sm:text-[10px] text-amber-300 leading-none">{morseToDotsAndDashes(currentCharBuffer)}</span>
                  </div>
                )}

                {!currentCharBuffer && committedChars.length === 0 && (
                  <span className="text-slate-600 text-[11px] sm:text-xs italic whitespace-nowrap">
                    {keyingMode === 'paddle' ? t.tapping.paddlePlaceholder : t.tapping.straightPlaceholder}
                  </span>
                )}
              </div>
            </div>

            {/* Tapping Keypad (Paddle vs Straight Key) */}
            {!isAnswered ? (
              <div className="no-select-callout space-y-1.5 sm:space-y-2">
                {keyingMode === 'paddle' ? (
                  /* Paddle Dual Keys */
                  <div className="keyer-surface grid grid-cols-2 gap-2 sm:gap-2.5" onContextMenu={(e) => e.preventDefault()}>
                    {/* Dot (短点) Button */}
                    <button
                      type="button"
                      onPointerDown={() => handleInputSymbol('.')}
                      className="h-16 sm:h-22 bg-gradient-to-b from-slate-800 to-slate-900 active:from-cyan-600 active:to-cyan-700 active:scale-95 text-slate-100 hover:text-white rounded-xl sm:rounded-2xl border-2 border-slate-700 active:border-cyan-400 shadow-md sm:shadow-lg flex flex-col items-center justify-center gap-0.5 transition-all select-none touch-manipulation cursor-pointer"
                    >
                      <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                      <span className="text-sm sm:text-lg font-black">{t.tapping.dotButton}</span>
                      <span className="text-[9px] sm:text-[10px] font-mono text-slate-400 hidden sm:inline">{t.tapping.keyJ}</span>
                    </button>

                    {/* Dash (長点) Button */}
                    <button
                      type="button"
                      onPointerDown={() => handleInputSymbol('-')}
                      className="h-16 sm:h-22 bg-gradient-to-b from-slate-800 to-slate-900 active:from-blue-600 active:to-blue-700 active:scale-95 text-slate-100 hover:text-white rounded-xl sm:rounded-2xl border-2 border-slate-700 active:border-blue-400 shadow-md sm:shadow-lg flex flex-col items-center justify-center gap-0.5 transition-all select-none touch-manipulation cursor-pointer"
                    >
                      <div className="w-8 h-2.5 sm:w-10 sm:h-3 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                      <span className="text-sm sm:text-lg font-black">{t.tapping.dashButton}</span>
                      <span className="text-[9px] sm:text-[10px] font-mono text-slate-400 hidden sm:inline">{t.tapping.keyK}</span>
                    </button>
                  </div>
                ) : (
                  /* Straight Key Button */
                  <div className="keyer-surface" onContextMenu={(e) => e.preventDefault()}>
                    <button
                      type="button"
                      onPointerDown={handleStraightKeyDown}
                      onPointerUp={handleStraightKeyUp}
                      onPointerLeave={handleStraightKeyUp}
                      onPointerCancel={handleStraightKeyUp}
                      className={`w-full h-20 sm:h-28 rounded-xl sm:rounded-2xl border-2 shadow-lg sm:shadow-xl flex flex-col items-center justify-center gap-0.5 sm:gap-1 transition-all select-none touch-manipulation cursor-pointer ${
                        activeSignal
                          ? 'bg-amber-500 border-amber-300 scale-95 shadow-[0_0_25px_rgba(245,158,11,0.8)]'
                          : 'bg-gradient-to-b from-slate-800 to-slate-900 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 ${activeSignal ? 'bg-white border-amber-200' : 'bg-slate-700 border-slate-600'}`} />
                      <span className="text-sm sm:text-lg font-black text-white">
                        {activeSignal ? t.tapping.straightActive : t.tapping.straightIdle}
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-slate-400">{t.tapping.straightDesc}</span>
                    </button>
                  </div>
                )}

                {/* Utility Controls & Submit */}
                <div className="grid grid-cols-4 gap-1 sm:gap-1.5">
                  <button
                    type="button"
                    onClick={commitCurrentChar}
                    disabled={!currentCharBuffer}
                    className="py-2 sm:py-2.5 px-1 bg-slate-800 hover:bg-slate-750 disabled:opacity-40 text-slate-200 text-[11px] sm:text-xs font-bold rounded-lg sm:rounded-xl border border-slate-700 flex items-center justify-center gap-0.5 transition"
                    title={t.tapping.nextCharTitle}
                  >
                    <CornerDownLeft size={13} />
                    <span>{t.tapping.nextChar}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleBackspace}
                    disabled={!currentCharBuffer && committedChars.length === 0}
                    className="py-2 sm:py-2.5 px-1 bg-slate-800 hover:bg-slate-750 disabled:opacity-40 text-slate-200 text-[11px] sm:text-xs font-bold rounded-lg sm:rounded-xl border border-slate-700 flex items-center justify-center gap-0.5 transition"
                    title={t.tapping.deleteTitle}
                  >
                    <Delete size={13} />
                    <span>{t.tapping.delete}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClear}
                    disabled={!currentCharBuffer && committedChars.length === 0}
                    className="py-2 sm:py-2.5 px-1 bg-slate-800 hover:bg-slate-750 disabled:opacity-40 text-slate-200 text-[11px] sm:text-xs font-bold rounded-lg sm:rounded-xl border border-slate-700 flex items-center justify-center gap-0.5 transition"
                    title={t.tapping.clearTitle}
                  >
                    <RotateCcw size={13} />
                    <span>{t.tapping.clear}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!currentCharBuffer && committedChars.length === 0}
                    className="py-2 sm:py-2.5 px-1 sm:px-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-slate-950 text-xs sm:text-sm font-black rounded-lg sm:rounded-xl shadow-md sm:shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-0.5"
                  >
                    <span>{t.tapping.submit}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Next Question Button */
              <div>
                <button
                  onClick={() => nextQuestion()}
                  className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold rounded-xl sm:rounded-2xl shadow-lg transition text-sm sm:text-base flex items-center justify-center gap-2"
                  autoFocus
                >
                  <span>{t.tapping.nextQuestion}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}

            {/* Result Breakdown */}
            {isAnswered && currentWord && targetConverted && (
              <div className="pt-1 animate-fadeIn">
                <div
                  className={`p-2.5 sm:p-3 rounded-xl border flex items-center justify-between ${
                    isCorrect
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle size={18} className="text-rose-400 shrink-0" />
                    )}
                    <div>
                      <div className="font-extrabold text-xs sm:text-base">
                        {isCorrect ? t.tapping.success : t.tapping.error}
                      </div>
                      <div className="text-[11px] opacity-80">
                        {t.tapping.targetLabel} <span className="font-bold text-white">{currentWord.text}</span> ({morseToDotsAndDashes(targetConverted.code)})
                      </div>
                    </div>
                  </div>

                  {isCorrect && (
                    <div className="font-mono text-[11px] sm:text-xs font-bold bg-emerald-900/60 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border border-emerald-700">
                      +{level === 'advanced' ? 30 : level === 'intermediate' ? 20 : 10} pts
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
