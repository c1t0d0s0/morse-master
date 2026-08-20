import React, { useState, useEffect, useRef } from 'react';
import { Play, Snail, CheckCircle2, XCircle, Eye, EyeOff, Sparkles, HelpCircle, ArrowRight, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TargetCharset, DifficultyLevel, AudioEngineSettings } from '../types';
import { getRandomQuizItem, QuizWord } from '../data/wordLists';
import { textToMorse, morseToDotsAndDashes } from '../data/morseData';
import { morseAudio } from '../audio/morseAudioEngine';
import { MorseVisualizer } from './MorseVisualizer';

interface ListeningQuizProps {
  settings: AudioEngineSettings;
  onOpenSettings: () => void;
}

export const ListeningQuiz: React.FC<ListeningQuizProps> = ({ settings }) => {
  const [charset, setCharset] = useState<TargetCharset>('all');
  const [level, setLevel] = useState<DifficultyLevel>('beginner');
  const [currentWord, setCurrentWord] = useState<QuizWord | null>(null);
  const [morseCode, setMorseCode] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showVisualSymbol, setShowVisualSymbol] = useState<boolean>(false); // 記号（・－）表示トグル
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeSymbol, setActiveSymbol] = useState<'.' | '-' | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [totalAnswered, setTotalAnswered] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement>(null);

  // 新規問題の出題
  const nextQuestion = (newCharset = charset, newLevel = level) => {
    morseAudio.stopPlayback();
    setIsPlaying(false);
    setActiveSymbol(null);

    const question = getRandomQuizItem(newCharset, newLevel);
    const converted = textToMorse(question.text, question.category === 'wabun');

    setCurrentWord(question);
    setMorseCode(converted.code);
    setUserInput('');
    setIsAnswered(false);
    setIsCorrect(false);

    // 出題時に自動再生
    setTimeout(() => {
      playAudio(converted.code, question.text);
      inputRef.current?.focus();
    }, 150);
  };

  // カテゴリやレベル変更時にリセット
  useEffect(() => {
    nextQuestion(charset, level);
  }, [charset, level]);

  // 音声再生
  const playAudio = async (code = morseCode, text = currentWord?.text || '', customSpeedRatio = 1.0) => {
    if (!code) return;
    setIsPlaying(true);
    const targetWpm = Math.max(5, Math.round(settings.wpm * customSpeedRatio));

    await morseAudio.playMorse(
      code,
      {
        onSymbolStart: info => {
          setActiveSymbol(info.symbol);
        },
        onSymbolEnd: () => {
          setActiveSymbol(null);
        },
        onComplete: () => {
          setIsPlaying(false);
          setActiveSymbol(null);
        },
      },
      targetWpm,
      text
    );
  };

  // 回答判定
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentWord || isAnswered) return;

    const sanitizedInput = userInput.trim().toUpperCase();
    const target = currentWord.text.toUpperCase();
    
    // カタカナ・ひらがな両対応の比較
    const isMatched = sanitizedInput === target || 
      (currentWord.category === 'wabun' && 
       sanitizedInput.replace(/[\u3041-\u3096]/g, m => String.fromCharCode(m.charCodeAt(0) + 0x60)) === target);

    setIsCorrect(isMatched);
    setIsAnswered(true);
    setTotalAnswered(prev => prev + 1);

    if (isMatched) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setScore(prev => prev + 10 * (level === 'advanced' ? 3 : level === 'intermediate' ? 2 : 1));
      
      // 3連勝ごとに紙吹雪
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

  const currentDetails = currentWord ? textToMorse(currentWord.text, currentWord.category === 'wabun') : null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Quiz Controls Header: Charset & Level */}
      <div className="bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-800 backdrop-blur shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Charset Selector */}
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
        </div>

        {/* Stats bar */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span>スコア: <strong className="text-cyan-400 font-mono text-sm">{score}</strong></span>
            <span>連続正解: <strong className="text-amber-400 font-mono text-sm">{streak}</strong> 🔥</span>
            <span>回答数: <strong className="text-slate-200 font-mono">{totalAnswered}</strong></span>
          </div>
          <div className="text-slate-500 font-mono">
            {settings.visualOnly ? '消音モード' : `${settings.wpm} WPM`}
          </div>
        </div>
      </div>

      {/* Main Quiz Board */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur shadow-2xl relative overflow-hidden">
        {/* Signal Visualizer & LED */}
        <div className="mb-6">
          <MorseVisualizer
            isActive={activeSymbol !== null}
            currentSymbol={activeSymbol}
            symbolText={showVisualSymbol || settings.visualOnly ? morseToDotsAndDashes(morseCode) : undefined}
            isVisualOnly={settings.visualOnly}
            showTextSymbol={showVisualSymbol || settings.visualOnly}
          />
        </div>

        {/* Playback Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <button
            onClick={() => playAudio(morseCode, currentWord?.text, 1.0)}
            disabled={isPlaying}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm sm:text-base shadow-lg transition-all ${
              isPlaying
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 animate-pulse cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/20 hover:scale-105'
            }`}
          >
            <Play size={18} fill={isPlaying ? 'none' : 'currentColor'} />
            {isPlaying ? '再生中...' : 'もう一度聴く'}
          </button>

          {/* Slow Replay */}
          <button
            onClick={() => playAudio(morseCode, currentWord?.text, 0.7)}
            disabled={isPlaying}
            className="flex items-center gap-1.5 px-4 py-3 rounded-2xl font-semibold text-xs sm:text-sm bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white transition disabled:opacity-50"
            title="速度を0.7倍にして再生"
          >
            <Snail size={16} className="text-amber-400" />
            ゆっくり (0.7x)
          </button>

          {/* Toggle Visual Dots/Dashes Display (消音時や初心者向けヒント) */}
          <button
            onClick={() => setShowVisualSymbol(!showVisualSymbol)}
            className={`flex items-center gap-1.5 px-4 py-3 rounded-2xl font-semibold text-xs sm:text-sm border transition ${
              showVisualSymbol
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="音が出せない場合やヒント用の「・－」記号表示"
          >
            {showVisualSymbol ? <EyeOff size={16} /> : <Eye size={16} />}
            {showVisualSymbol ? '記号を隠す' : '記号で見る (・－)'}
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              disabled={isAnswered}
              placeholder={currentWord?.category === 'wabun' ? 'カタカナまたは文字を入力...' : '文字または単語を入力...'}
              className="w-full bg-slate-950/80 border-2 border-slate-700 focus:border-cyan-400 rounded-2xl px-5 py-4 text-center text-xl sm:text-2xl font-bold tracking-widest text-slate-100 placeholder-slate-600 focus:outline-none transition uppercase shadow-inner"
              autoComplete="off"
              autoFocus
            />
          </div>

          {!isAnswered ? (
            <button
              type="submit"
              disabled={!userInput.trim()}
              className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-extrabold rounded-2xl shadow-lg transition text-base"
            >
              回答する (Enter)
            </button>
          ) : (
            <button
              type="button"
              onClick={() => nextQuestion()}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold rounded-2xl shadow-lg transition text-base flex items-center justify-center gap-2"
              autoFocus
            >
              <span>次の問題へ</span>
              <ArrowRight size={18} />
            </button>
          )}
        </form>

        {/* Answer Result & Breakdown */}
        {isAnswered && currentWord && currentDetails && (
          <div className="mt-8 pt-6 border-t border-slate-800 animate-fadeIn">
            {/* Success / Error Banner */}
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between mb-6 ${
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
                    {isCorrect ? '正解！ Perfect!' : 'おしい！ 不正解'}
                  </div>
                  <div className="text-xs opacity-80">
                    正解: <span className="font-bold text-white text-sm">{currentWord.text}</span>
                    {currentWord.meaningJa && ` (${currentWord.meaningJa})`}
                  </div>
                </div>
              </div>

              {isCorrect && (
                <div className="flex items-center gap-1 font-mono text-sm font-bold bg-emerald-900/60 px-3 py-1 rounded-xl border border-emerald-700">
                  <Sparkles size={14} className="text-amber-300" />
                  +{level === 'advanced' ? 30 : level === 'intermediate' ? 20 : 10} pts
                </div>
              )}
            </div>

            {/* Character Breakdown & Mnemonics */}
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <div className="text-xs font-semibold text-slate-400 mb-3 flex items-center gap-1.5">
                <HelpCircle size={14} className="text-cyan-400" />
                符号の分解と覚え方:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentDetails.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-slate-900/80 rounded-xl border border-slate-800"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-lg bg-cyan-950 text-cyan-300 font-extrabold flex items-center justify-center border border-cyan-800 text-base">
                        {item.char}
                      </span>
                      <div>
                        <div className="font-mono text-sm font-bold text-amber-300 tracking-wider">
                          {morseToDotsAndDashes(item.code)}
                        </div>
                        {item.mnemonic && (
                          <div className="text-[11px] text-slate-400">{item.mnemonic}</div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => playAudio(item.code, item.char)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 transition"
                      title="この文字の音を聴く"
                    >
                      <Volume2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
