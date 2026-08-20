import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, Delete, CornerDownLeft, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TargetCharset, DifficultyLevel, AudioEngineSettings, KeyingMode } from '../types';
import { getRandomQuizItem, QuizWord } from '../data/wordLists';
import { textToMorse, morseToDotsAndDashes, morseToText } from '../data/morseData';
import { morseAudio } from '../audio/morseAudioEngine';
import { MorseVisualizer } from './MorseVisualizer';

interface TappingQuizProps {
  settings: AudioEngineSettings;
}

export const TappingQuiz: React.FC<TappingQuizProps> = ({ settings }) => {
  const [charset, setCharset] = useState<TargetCharset>('all');
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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Settings & Filter Header */}
      <div className="bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-800 backdrop-blur shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Charset selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-semibold text-slate-400 mr-1">対象:</span>
            {[
              { id: 'all', label: 'すべて' },
              { id: 'alphabet', label: '欧文 (A-Z)' },
              { id: 'number', label: '数字 (0-9)' },
              { id: 'wabun', label: '和文 (カナ)' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCharset(tab.id as TargetCharset)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
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
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-400 mr-1">難易度:</span>
            {[
              { id: 'beginner', label: '初級 (1文字)' },
              { id: 'intermediate', label: '中級 (単語)' },
              { id: 'advanced', label: '上級 (長文)' },
            ].map(l => (
              <button
                key={l.id}
                onClick={() => setLevel(l.id as DifficultyLevel)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
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
          <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setKeyingMode('paddle')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                keyingMode === 'paddle'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="短点と長点の2つのボタンで入力"
            >
              パドル方式
            </button>
            <button
              onClick={() => setKeyingMode('straight')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                keyingMode === 'straight'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="押している長さで短点・長点を判定"
            >
              電鍵 (長押し)
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span>スコア: <strong className="text-cyan-400 font-mono text-sm">{score}</strong></span>
            <span>連続正解: <strong className="text-amber-400 font-mono text-sm">{streak}</strong> 🔥</span>
          </div>
          <div className="text-slate-500">
            {keyingMode === 'paddle' ? 'PCキー: [J]=短点, [K]=長点, [Space]=次へ' : 'PCキー: [Space]=電鍵長押し'}
          </div>
        </div>
      </div>

      {/* Main Practice Board */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur shadow-2xl relative">
        {/* Target Word / Character Prompt */}
        <div className="text-center mb-6">
          <span className="text-xs uppercase font-mono tracking-widest text-slate-400 block mb-2">
            お題 (TARGET PROMPT)
          </span>
          <div className="inline-block px-8 py-3 bg-gradient-to-b from-slate-950 to-slate-900 border-2 border-cyan-500/40 rounded-3xl shadow-xl shadow-cyan-500/10">
            <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-blue-300 tracking-wider">
              {currentWord?.text}
            </span>
          </div>
          {currentWord?.meaningJa && (
            <div className="text-xs text-slate-400 mt-2">{currentWord.meaningJa}</div>
          )}

          {/* Hint Toggle */}
          <div className="mt-3">
            <button
              onClick={() => setShowHint(!showHint)}
              className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 bg-amber-950/40 px-3 py-1 rounded-full border border-amber-800/60 transition"
            >
              <HelpCircle size={14} />
              {showHint ? 'ヒントを隠す' : '符号のヒントを見る'}
            </button>
            {showHint && targetConverted && (
              <div className="mt-2 text-sm font-mono text-amber-300 font-bold tracking-widest animate-fadeIn">
                {morseToDotsAndDashes(targetConverted.code)}
              </div>
            )}
          </div>
        </div>

        {/* Real-time Visualizer */}
        <div className="mb-6">
          <MorseVisualizer
            isActive={activeSignal}
            currentSymbol={currentSymbol}
            symbolText={currentCharBuffer ? morseToDotsAndDashes(currentCharBuffer) : undefined}
            isVisualOnly={settings.visualOnly}
            showTextSymbol={true}
          />
        </div>

        {/* User Input Progress Display (Fixed height container to prevent button jumping) */}
        <div className="mb-6 px-4 py-3 bg-slate-950/80 rounded-2xl border border-slate-800 h-24 flex flex-col justify-center items-center overflow-hidden">
          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 mb-1 shrink-0">
            入力中の符号と文字
          </span>

          <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1 px-2 no-scrollbar justify-center">
            {/* Committed characters */}
            {committedChars.map((char, idx) => (
              <div key={idx} className="flex flex-col items-center bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-700 shrink-0">
                <span className="text-base font-bold text-white leading-tight">{char}</span>
                <span className="font-mono text-[10px] text-cyan-400 leading-tight">{morseToDotsAndDashes(committedCodes[idx])}</span>
              </div>
            ))}

            {/* Currently typing character buffer */}
            {currentCharBuffer && (
              <div className="flex flex-col items-center bg-cyan-950/60 px-2.5 py-1 rounded-xl border-2 border-cyan-400 animate-pulse shrink-0">
                <span className="text-base font-bold text-cyan-300 leading-tight">{currentPreviewChar || '?'}</span>
                <span className="font-mono text-[10px] text-amber-300 leading-tight">{morseToDotsAndDashes(currentCharBuffer)}</span>
              </div>
            )}

            {!currentCharBuffer && committedChars.length === 0 && (
              <span className="text-slate-600 text-xs sm:text-sm italic whitespace-nowrap">
                {keyingMode === 'paddle' ? '下の「・」「－」ボタンをタップして送信' : '下の電鍵ボタンを押して打鍵'}
              </span>
            )}
          </div>
        </div>

        {/* Tapping Keypad (Paddle vs Straight Key) */}
        {!isAnswered ? (
          <div className="space-y-4">
            {keyingMode === 'paddle' ? (
              /* Paddle Dual Keys */
              <div className="grid grid-cols-2 gap-4">
                {/* Dot (短点) Button */}
                <button
                  type="button"
                  onPointerDown={() => handleInputSymbol('.')}
                  className="h-28 sm:h-32 bg-gradient-to-b from-slate-800 to-slate-900 active:from-cyan-600 active:to-cyan-700 active:scale-95 text-slate-100 hover:text-white rounded-3xl border-2 border-slate-700 active:border-cyan-400 shadow-xl flex flex-col items-center justify-center gap-1 transition-all select-none touch-manipulation cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
                  <span className="text-lg sm:text-xl font-black">短点 ( ・ )</span>
                  <span className="text-[11px] font-mono text-slate-400">キー [ J ]</span>
                </button>

                {/* Dash (長点) Button */}
                <button
                  type="button"
                  onPointerDown={() => handleInputSymbol('-')}
                  className="h-28 sm:h-32 bg-gradient-to-b from-slate-800 to-slate-900 active:from-blue-600 active:to-blue-700 active:scale-95 text-slate-100 hover:text-white rounded-3xl border-2 border-slate-700 active:border-blue-400 shadow-xl flex flex-col items-center justify-center gap-1 transition-all select-none touch-manipulation cursor-pointer"
                >
                  <div className="w-12 h-4 rounded-full bg-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
                  <span className="text-lg sm:text-xl font-black">長点 ( － )</span>
                  <span className="text-[11px] font-mono text-slate-400">キー [ K ]</span>
                </button>
              </div>
            ) : (
              /* Straight Key Button */
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onPointerDown={handleStraightKeyDown}
                  onPointerUp={handleStraightKeyUp}
                  onPointerLeave={handleStraightKeyUp}
                  className={`w-full h-36 rounded-3xl border-2 shadow-2xl flex flex-col items-center justify-center gap-2 transition-all select-none touch-manipulation cursor-pointer ${
                    activeSignal
                      ? 'bg-amber-500 border-amber-300 scale-95 shadow-[0_0_30px_rgba(245,158,11,0.8)]'
                      : 'bg-gradient-to-b from-slate-800 to-slate-900 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full border-4 ${activeSignal ? 'bg-white border-amber-200' : 'bg-slate-700 border-slate-600'}`} />
                  <span className="text-xl font-black text-white">
                    {activeSignal ? '電波送信中...' : '電鍵をタップ / 長押し'}
                  </span>
                  <span className="text-xs text-slate-400">短押し=短点 (・) / 長押し=長点 (－)</span>
                </button>
              </div>
            )}

            {/* Utility Controls: Next Char, Backspace, Submit */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-2">
              <button
                type="button"
                onClick={commitCurrentChar}
                disabled={!currentCharBuffer}
                className="py-3 px-2 bg-slate-800 hover:bg-slate-750 disabled:opacity-40 text-slate-200 text-xs sm:text-sm font-bold rounded-xl border border-slate-700 flex items-center justify-center gap-1 transition"
                title="現在の文字を確定して次の文字へ"
              >
                <CornerDownLeft size={16} />
                <span>次の文字 (Space)</span>
              </button>

              <button
                type="button"
                onClick={handleBackspace}
                disabled={!currentCharBuffer && committedChars.length === 0}
                className="py-3 px-2 bg-slate-800 hover:bg-slate-750 disabled:opacity-40 text-slate-200 text-xs sm:text-sm font-bold rounded-xl border border-slate-700 flex items-center justify-center gap-1 transition"
                title="直前の入力を1つ削除"
              >
                <Delete size={16} />
                <span>削除 (BS)</span>
              </button>

              <button
                type="button"
                onClick={handleClear}
                disabled={!currentCharBuffer && committedChars.length === 0}
                className="py-3 px-2 bg-slate-800 hover:bg-slate-750 disabled:opacity-40 text-slate-200 text-xs sm:text-sm font-bold rounded-xl border border-slate-700 flex items-center justify-center gap-1 transition hidden sm:flex"
                title="入力をすべてクリア"
              >
                <RotateCcw size={16} />
                <span>全消去</span>
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!currentCharBuffer && committedChars.length === 0}
                className="py-3 px-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-slate-950 text-xs sm:text-sm font-extrabold rounded-xl shadow-lg transition flex items-center justify-center gap-1 col-span-1 sm:col-span-1"
              >
                <span>判定する (Enter)</span>
              </button>
            </div>
          </div>
        ) : (
          /* Next Question Button */
          <div className="mt-4">
            <button
              onClick={() => nextQuestion()}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold rounded-2xl shadow-lg transition text-base flex items-center justify-center gap-2"
              autoFocus
            >
              <span>次の問題へ進む</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Result Breakdown */}
        {isAnswered && currentWord && targetConverted && (
          <div className="mt-6 pt-6 border-t border-slate-800 animate-fadeIn">
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between mb-4 ${
                isCorrect
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
              }`}
            >
              <div className="flex items-center gap-3">
                {isCorrect ? (
                  <CheckCircle2 size={28} className="text-emerald-400 shrink-0" />
                ) : (
                  <XCircle size={28} className="text-rose-400 shrink-0" />
                )}
                <div>
                  <div className="font-extrabold text-lg">
                    {isCorrect ? '送信成功！ Accurate!' : '送信ミス！ Check Morse'}
                  </div>
                  <div className="text-xs opacity-80">
                    目標: <span className="font-bold text-white">{currentWord.text}</span> ({morseToDotsAndDashes(targetConverted.code)})
                  </div>
                </div>
              </div>

              {isCorrect && (
                <div className="font-mono text-sm font-bold bg-emerald-900/60 px-3 py-1 rounded-xl border border-emerald-700">
                  +{level === 'advanced' ? 30 : level === 'intermediate' ? 20 : 10} pts
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
