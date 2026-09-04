import React, { useState, useEffect, useCallback } from 'react';
import { ChallengeConfig, ChallengeResult } from '../../data/models/ChallengeModels';
import { Question } from '../../data/models/Question';
import { ChallengeEngine } from '../../core/challenge/ChallengeEngine';
import { TimerState } from '../../core/timer/CrossPlatformTimer';
import { QuestionScoreResult, SpeedFeedbackType } from '../../core/types';
import { WebAudioEngine } from '../../platform/audio/WebAudioEngine';
import { HapticService } from '../../platform/haptics/HapticService';
import { VisualQuestionCard } from '../../components/VisualQuestionCard';
import { getHintText } from '../../data/models/Question';
import { Lightbulb, ChevronUp, ChevronDown, Flame, Zap, ArrowLeft } from 'lucide-react';

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
        setCurrentQuestion(q);
        setQuestionIndex(idx);
        setTotalQuestions(total);
        setSelectedOption(null);
        setEvaluatingResult(null);
        setSpeedBonusAlert(null);
        setIsHintOpen(false); // Auto-collapse hint for each new question
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
        setScore((prev) => Math.round((prev + result.totalQuestionScore) * 10) / 10);
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

  // Desktop & Keyboard Shortcuts: 1, 2, 3, 4, Space (hint), Escape (exit)
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
      <div className="flex-1 flex items-center justify-center bg-slate-950 text-slate-400">
        <p>Loading Scripture Challenge...</p>
      </div>
    );
  }

  const timePercent = Math.max(0, Math.min(100, (remainingTime / totalTime) * 100));
  const isTimeCritical = remainingTime <= 10;
  const hintText = getHintText(currentQuestion);

  return (
    <div className="flex-1 flex flex-col justify-between bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 overflow-hidden select-none">
      {/* 1. TOP STATUS BAR: TIME | SCORE | COMBO */}
      <header className="w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-2.5 z-20">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <button
            onClick={onExit}
            className="p-1.5 -ml-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Exit Challenge"
            aria-label="Exit Challenge"
          >
            <ArrowLeft size={20} />
          </button>

          {/* TIME */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] tracking-wider uppercase text-slate-400 font-bold">TIME</span>
            <span
              className={`font-mono text-xl font-extrabold tracking-tight transition-colors ${
                isTimeCritical ? 'text-rose-400 animate-pulse' : 'text-slate-100'
              }`}
            >
              {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')}
            </span>
          </div>

          {/* SCORE */}
          <div className="flex flex-col items-center relative">
            <span className="text-[10px] tracking-wider uppercase text-slate-400 font-bold">SCORE</span>
            <div className="flex items-center gap-1">
              <span className="font-mono text-xl font-extrabold text-amber-400">{score.toFixed(1)}</span>
              {speedBonusAlert && (
                <span className="absolute -bottom-4 text-[10px] font-bold text-emerald-400 whitespace-nowrap animate-bounce">
                  +{speedBonusAlert.amount} {speedBonusAlert.message}
                </span>
              )}
            </div>
          </div>

          {/* COMBO */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] tracking-wider uppercase text-slate-400 font-bold">COMBO</span>
            <div className="flex items-center gap-1">
              {combo >= 3 && <Flame size={16} className="text-amber-500 animate-bounce" />}
              <span
                className={`font-mono text-xl font-extrabold ${
                  combo >= 5 ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'text-slate-200'
                }`}
              >
                {combo}x
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-800 h-1 mt-2 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-200 ${
              isTimeCritical ? 'bg-rose-500' : 'bg-gradient-to-r from-amber-500 to-indigo-500'
            }`}
            style={{ width: `${timePercent}%` }}
          />
        </div>
      </header>

      {/* 2. CENTRAL GAMEPLAY AREA (Strictly: Question, Optional Image, 4 Options) */}
      <main className="flex-1 flex flex-col justify-center max-w-xl w-full mx-auto px-4 py-2 overflow-y-auto">
        {/* Question Header & Scripture Pill */}
        <div className="text-center mb-2">
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 mb-2">
            Question {questionIndex + 1} of {totalQuestions} • {currentQuestion.difficulty}
          </span>
          <h1 className="text-lg md:text-xl font-bold leading-snug text-slate-50">
            {currentQuestion.question}
          </h1>
        </div>

        {/* Optional Visual Image */}
        <VisualQuestionCard question={currentQuestion} />

        {/* FOUR ANSWER OPTIONS (A, B, C, D) */}
        <div className="grid grid-cols-1 gap-2.5 mt-2">
          {currentQuestion.options.map((option, idx) => {
            const letter = String.fromCharCode(65 + idx); // A, B, C, D
            const isSelected = selectedOption === option;
            const isCorrect = option === currentQuestion.correctAnswer;

            let buttonStyle = 'bg-slate-800/90 border-slate-700/80 hover:bg-slate-750 text-slate-100';

            if (evaluatingResult) {
              if (isCorrect) {
                buttonStyle = 'bg-emerald-900/90 border-emerald-500 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
              } else if (isSelected && !isCorrect) {
                buttonStyle = 'bg-rose-900/90 border-rose-500 text-rose-100';
              } else {
                buttonStyle = 'bg-slate-900/50 border-slate-800 text-slate-500 opacity-60';
              }
            } else if (isSelected) {
              buttonStyle = 'bg-indigo-900/90 border-indigo-400 text-white';
            }

            return (
              <button
                key={option}
                onClick={() => handleSelectOption(option)}
                disabled={selectedOption !== null}
                className={`relative flex items-center min-h-[52px] p-3 rounded-xl border text-left font-medium transition-all ${buttonStyle} focus:outline-none focus:ring-2 focus:ring-amber-400/60 active:scale-[0.99]`}
                aria-label={`Option ${letter}: ${option}`}
              >
                <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center text-xs font-bold mr-3 text-amber-400">
                  {letter}
                </span>
                <span className="flex-1 text-sm md:text-base leading-snug">{option}</span>
                <span className="hidden md:inline-block text-[10px] text-slate-500 ml-2 font-mono">
                  [{idx + 1}]
                </span>
              </button>
            );
          })}
        </div>
      </main>

      {/* 3. ANCHORED BOTTOM HINT (Permanently separated at bottom) */}
      <footer className="w-full bg-slate-900/95 backdrop-blur-md border-t border-slate-800/90 z-20">
        <div className="max-w-xl mx-auto px-4 py-2">
          <button
            onClick={toggleHint}
            className="w-full flex items-center justify-between py-1.5 px-3 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 text-amber-300 text-xs font-semibold transition-colors"
            aria-expanded={isHintOpen}
          >
            <div className="flex items-center gap-2">
              <Lightbulb size={16} className={isHintOpen ? 'text-amber-400 animate-pulse' : 'text-amber-400'} />
              <span>{isHintOpen ? 'Hide Scripture Hint' : '💡 Reveal Scripture Hint'}</span>
            </div>
            {isHintOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>

          {isHintOpen && (
            <div className="mt-2 p-3 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs leading-relaxed animate-in fade-in slide-in-from-bottom duration-200">
              <p className="font-semibold text-amber-300 mb-0.5">
                📖 {currentQuestion.book} {currentQuestion.chapter}:{currentQuestion.verse}
              </p>
              <p className="text-slate-300">{hintText}</p>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};
