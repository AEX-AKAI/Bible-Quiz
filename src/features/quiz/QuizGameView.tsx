import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChallengeConfig, ChallengeResult } from '../../data/models/ChallengeModels';
import { Question } from '../../data/models/Question';
import { ChallengeEngine } from '../../core/challenge/ChallengeEngine';
import { TimerState } from '../../core/timer/CrossPlatformTimer';
import { QuestionScoreResult, QuestionDifficultyStage } from '../../core/types';
import { WebAudioEngine } from '../../platform/audio/WebAudioEngine';
import { HapticService } from '../../platform/haptics/HapticService';
import { VisualQuestionCard } from '../../components/VisualQuestionCard';
import { getHintText } from '../../data/models/Question';
import { Lightbulb, ChevronUp, ChevronDown, Flame, ArrowLeft, Zap, Sparkles, TrendingUp } from 'lucide-react';

interface Props {
  config: ChallengeConfig;
  questions: Question[];
  playerName: string;
  onComplete: (result: ChallengeResult) => void;
  onExit: () => void;
  reduceAnimations?: boolean;
}

export const QuizGameView: React.FC<Props> = ({
  config,
  questions,
  playerName,
  onComplete,
  onExit,
  reduceAnimations = false,
}) => {
  const [engine, setEngine] = useState<ChallengeEngine | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(questions.length);

  const [remainingTime, setRemainingTime] = useState<number>(config.timeLimitSeconds);
  const [totalTime, setTotalTime] = useState<number>(config.timeLimitSeconds);

  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [evaluatingResult, setEvaluatingResult] = useState<QuestionScoreResult | null>(null);
  const [speedBonusAlert, setSpeedBonusAlert] = useState<{ amount: number; message: string } | null>(null);

  // Difficulty Tier Change Banner (Self-dismissing)
  const [difficultyBanner, setDifficultyBanner] = useState<string | null>(null);
  const prevDifficultyRef = useRef<QuestionDifficultyStage | null>(null);

  // Score pop micro-interaction
  const [scoreUpdated, setScoreUpdated] = useState(false);

  // Anchored Bottom Hint State
  const [isHintOpen, setIsHintOpen] = useState(false);

  const audioEngine = WebAudioEngine.getInstance();
  const haptic = HapticService.getInstance();

  // Initialize and start the engine
  useEffect(() => {
    audioEngine.playChallengeStart();
    audioEngine.startAmbient('NORMAL');

    const newEngine = new ChallengeEngine(config, questions, playerName, {
      onQuestionChanged: (q, idx, total) => {
        // Detect difficulty progression transition
        if (prevDifficultyRef.current && prevDifficultyRef.current !== q.difficulty && idx > 0) {
          setDifficultyBanner(`${prevDifficultyRef.current} → ${q.difficulty}`);
          setTimeout(() => setDifficultyBanner(null), 1800);
        }
        prevDifficultyRef.current = q.difficulty;

        setCurrentQuestion(q);
        setQuestionIndex(idx);
        setTotalQuestions(total);
        setSelectedOption(null);
        setEvaluatingResult(null);
        setSpeedBonusAlert(null);
        setIsHintOpen(false); // Reset hint for each new question
      },
      onTimerTick: (state: TimerState) => {
        setRemainingTime(state.remainingSeconds);
        setTotalTime(state.totalSeconds);

        // Adjust ambient mood when under 10 seconds
        if (state.remainingSeconds <= 10 && state.remainingSeconds > 0) {
          audioEngine.setAmbientMood('URGENCY');
          if (state.remainingSeconds <= 5) {
            audioEngine.playTimerWarning();
          }
        }
      },
      onAnswerFeedback: (result, isSpeedBonus) => {
        setEvaluatingResult(result);
        setScore((prev) => {
          const nextScore = Math.round((prev + result.totalQuestionScore) * 10) / 10;
          return nextScore;
        });
        setScoreUpdated(true);
        setTimeout(() => setScoreUpdated(false), 400);

        setCombo(result.currentCombo);

        if (result.isCorrect) {
          audioEngine.playCorrectAnswer();
          haptic.success();

          if (isSpeedBonus) {
            audioEngine.playSpeedBonus();
            setSpeedBonusAlert({
              amount: result.adjustedSpeedBonus,
              message: result.message,
            });
          }

          if (result.currentCombo >= 3) {
            audioEngine.playComboStreak(result.currentCombo);
            if (result.currentCombo >= 5) {
              audioEngine.setAmbientMood('HIGH_COMBO');
            }
          }
        } else {
          audioEngine.playIncorrectAnswer();
          haptic.error();
          audioEngine.setAmbientMood('NORMAL');
        }
      },
      onChallengeComplete: (result) => {
        audioEngine.stopAmbient();
        audioEngine.playVictoryFanfare();
        onComplete(result);
      },
    });

    setEngine(newEngine);
    newEngine.start();

    return () => {
      newEngine.cancel();
      audioEngine.stopAmbient();
    };
  }, []);

  const handleSelectOption = useCallback(
    (option: string) => {
      if (!engine || selectedOption !== null) return;
      setSelectedOption(option);
      haptic.lightTap();
      audioEngine.playButtonTap();
      engine.submitAnswer(option);
    },
    [engine, selectedOption, haptic, audioEngine]
  );

  const toggleHint = useCallback(() => {
    setIsHintOpen((prev) => {
      if (!prev) {
        audioEngine.playHintDisclosure();
        haptic.lightTap();
      }
      return !prev;
    });
  }, [audioEngine, haptic]);

  // Desktop & Keyboard Shortcuts: 1, 2, 3, 4, Space/H (hint), Escape (exit)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentQuestion || selectedOption !== null) return;

      if (e.key === '1' && currentQuestion.options[0]) {
        handleSelectOption(currentQuestion.options[0]);
      } else if (e.key === '2' && currentQuestion.options[1]) {
        handleSelectOption(currentQuestion.options[1]);
      } else if (e.key === '3' && currentQuestion.options[2]) {
        handleSelectOption(currentQuestion.options[2]);
      } else if (e.key === '4' && currentQuestion.options[3]) {
        handleSelectOption(currentQuestion.options[3]);
      } else if (e.key === ' ' || e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        toggleHint();
      } else if (e.key === 'Escape') {
        onExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, selectedOption, handleSelectOption, toggleHint, onExit]);

  if (!currentQuestion) {
    return (
      <div className="flex-1 flex items-center justify-center celestial-bg text-slate-400">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 mx-auto rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 animate-pulse">
            <Sparkles size={20} />
          </div>
          <p className="text-xs font-semibold tracking-wider uppercase text-slate-300">
            Preparing Scripture Challenge...
          </p>
        </div>
      </div>
    );
  }

  const timePercent = Math.max(0, Math.min(100, (remainingTime / totalTime) * 100));
  const isTimeCritical = remainingTime <= 10;
  const isFinalFive = remainingTime <= 5 && remainingTime > 0;
  const hintText = getHintText(currentQuestion);

  return (
    <div className="flex-1 flex flex-col justify-between celestial-bg parchment-pattern text-slate-100 overflow-hidden select-none relative">
      
      {/* 1. TOP HEADER: TIME | SCORE | COMBO */}
      <header className="w-full backdrop-blur-md bg-slate-950/80 border-b border-amber-500/15 px-4 pt-2 pb-2.5 z-20 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          
          {/* Back Button */}
          <button
            onClick={onExit}
            className="p-2 -ml-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all active:scale-95"
            title="Exit Challenge"
            aria-label="Exit Challenge"
          >
            <ArrowLeft size={18} />
          </button>

          {/* TIME */}
          <div className="flex flex-col items-center">
            <span className="text-[9px] tracking-widest uppercase text-slate-400 font-bold">
              TIME
            </span>
            <span
              className={`font-mono text-xl sm:text-2xl font-black tracking-tight transition-all ${
                isFinalFive
                  ? 'text-rose-400 animate-pulse scale-105 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                  : isTimeCritical
                  ? 'text-amber-400'
                  : 'text-slate-100'
              }`}
            >
              {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')}
            </span>
          </div>

          {/* SCORE */}
          <div className="flex flex-col items-center relative">
            <span className="text-[9px] tracking-widest uppercase text-slate-400 font-bold">
              SCORE
            </span>
            <div className="flex items-center gap-1">
              <span
                className={`font-mono text-xl sm:text-2xl font-black text-amber-400 transition-transform ${
                  scoreUpdated ? 'score-updated' : ''
                }`}
              >
                {score.toFixed(1)}
              </span>
            </div>

            {/* Non-intrusive floating speed bonus indicator */}
            {speedBonusAlert && (
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-extrabold text-emerald-400 bg-emerald-950/90 border border-emerald-500/40 px-2 py-0.2 rounded-full shadow-md animate-in fade-in slide-in-from-top-1 duration-200">
                +{speedBonusAlert.amount} {speedBonusAlert.message}
              </div>
            )}
          </div>

          {/* COMBO */}
          <div className="flex flex-col items-center">
            <span className="text-[9px] tracking-widest uppercase text-slate-400 font-bold">
              COMBO
            </span>
            <div className="flex items-center gap-1">
              {combo >= 3 && (
                <Flame
                  size={15}
                  className={`text-amber-500 ${combo >= 5 ? 'animate-bounce text-orange-400' : ''}`}
                />
              )}
              <span
                className={`font-mono text-xl sm:text-2xl font-black tracking-tight ${
                  combo >= 5
                    ? 'text-amber-300 drop-shadow-[0_0_10px_rgba(245,158,11,0.6)] combo-flare'
                    : combo >= 3
                    ? 'text-amber-400'
                    : 'text-slate-300'
                }`}
              >
                {combo}x
              </span>
            </div>
          </div>
        </div>

        {/* Precision Progress Bar */}
        <div className="max-w-2xl mx-auto w-full bg-slate-900/80 h-1.5 mt-2 rounded-full overflow-hidden border border-slate-800/80">
          <div
            className={`h-full transition-all duration-200 ${
              isTimeCritical
                ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.7)]'
                : 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300'
            }`}
            style={{ width: `${timePercent}%` }}
          />
        </div>
      </header>

      {/* DIFFICULTY PROGRESSION NOTIFICATION TOAST */}
      {difficultyBanner && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 animate-in fade-in slide-in-from-top-2 duration-200 pointer-events-none">
          <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-amber-500/30">
            <TrendingUp size={14} />
            <span>Difficulty Elevated: {difficultyBanner}</span>
          </div>
        </div>
      )}

      {/* 2. CENTRAL FOCUSED GAMEPLAY AREA */}
      <main className="flex-1 flex flex-col justify-center max-w-2xl w-full mx-auto px-4 py-3 overflow-y-auto">
        
        {/* Question Header & Meta Pill */}
        <div className="text-center mb-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-900/90 border border-amber-500/20 text-amber-300 mb-2.5 shadow-sm">
            <span>Question {questionIndex + 1} of {totalQuestions}</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300 uppercase tracking-wider text-[10px]">
              {currentQuestion.difficulty.replace('_', ' ')}
            </span>
          </div>

          {/* Question Text */}
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold leading-snug text-white max-w-xl mx-auto px-1">
            {currentQuestion.question}
          </h1>
        </div>

        {/* Optional Visual Image Card */}
        <VisualQuestionCard question={currentQuestion} />

        {/* FOUR ANSWER OPTIONS (A, B, C, D) */}
        <div className="grid grid-cols-1 gap-2.5 mt-3 max-w-xl w-full mx-auto">
          {currentQuestion.options.map((option, idx) => {
            const letter = String.fromCharCode(65 + idx); // A, B, C, D
            const isSelected = selectedOption === option;
            const isCorrect = option === currentQuestion.correctAnswer;

            let buttonClass = 'bg-slate-900/85 border-slate-750/90 hover:border-amber-500/40 hover:bg-slate-850 text-slate-100';

            if (evaluatingResult) {
              if (isCorrect) {
                buttonClass = 'bg-emerald-950/90 border-emerald-400 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400/50';
              } else if (isSelected && !isCorrect) {
                buttonClass = 'bg-rose-950/90 border-rose-500 text-rose-100 ring-1 ring-rose-400/50';
              } else {
                buttonClass = 'bg-slate-950/40 border-slate-850 text-slate-500 opacity-50';
              }
            } else if (isSelected) {
              buttonClass = 'bg-amber-950/60 border-amber-400 text-white ring-1 ring-amber-400';
            }

            return (
              <button
                key={option}
                onClick={() => handleSelectOption(option)}
                disabled={selectedOption !== null}
                className={`group relative flex items-center min-h-[54px] p-3.5 rounded-xl border text-left font-medium transition-all sacred-card-interactive ${buttonClass} focus:outline-none focus:ring-2 focus:ring-amber-400/60 active:scale-[0.985]`}
                aria-label={`Option ${letter}: ${option}`}
              >
                {/* Letter Badge */}
                <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black mr-3 transition-colors ${
                  evaluatingResult && isCorrect
                    ? 'bg-emerald-500 text-slate-950'
                    : evaluatingResult && isSelected && !isCorrect
                    ? 'bg-rose-500 text-white'
                    : 'bg-black/40 border border-white/10 text-amber-400 group-hover:border-amber-500/40'
                }`}>
                  {letter}
                </span>

                {/* Option Text */}
                <span className="flex-1 text-sm sm:text-base leading-snug font-medium">
                  {option}
                </span>

                {/* Keyboard Shortcut Indicator on Desktop */}
                <span className="hidden md:inline-block text-[10px] text-slate-500 group-hover:text-amber-400/60 ml-2 font-mono">
                  [{idx + 1}]
                </span>
              </button>
            );
          })}
        </div>
      </main>

      {/* 3. ANCHORED BOTTOM HINT (Permanently anchored at bottom) */}
      <footer className="w-full bg-slate-950/90 backdrop-blur-md border-t border-amber-500/15 z-20">
        <div className="max-w-2xl mx-auto px-4 py-2">
          <button
            onClick={toggleHint}
            className="w-full flex items-center justify-between py-2 px-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 text-amber-300 text-xs font-bold transition-all active:scale-[0.99]"
            aria-expanded={isHintOpen}
          >
            <div className="flex items-center gap-2">
              <Lightbulb size={16} className={`text-amber-400 ${isHintOpen ? 'animate-pulse' : ''}`} />
              <span>{isHintOpen ? 'Hide Scripture Hint' : '💡 Reveal Scripture Reference Hint'}</span>
            </div>
            {isHintOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>

          {isHintOpen && (
            <div className="mt-2 p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-100 text-xs leading-relaxed animate-in fade-in slide-in-from-bottom duration-150">
              <p className="font-bold text-amber-300 mb-0.5">
                📖 {currentQuestion.book} {currentQuestion.chapter}:{currentQuestion.verse}
              </p>
              <p className="text-slate-300 font-sans">{hintText}</p>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};
