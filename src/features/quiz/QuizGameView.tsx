import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChallengeConfig, ChallengeResult } from '../../data/models/ChallengeModels';
import { Question } from '../../data/models/Question';
import { ChallengeEngine } from '../../core/challenge/ChallengeEngine';
import { TimerState } from '../../core/timer/CrossPlatformTimer';
import { QuestionScoreResult, QuestionDifficultyStage } from '../../core/types';
import { WebAudioEngine } from '../../platform/audio/WebAudioEngine';
import { HapticService } from '../../platform/haptics/HapticService';
import { getHintText } from '../../data/models/Question';
import { QuestionRepository } from '../../data/repositories/QuestionRepository';
import { AppNavbar } from '../../components/AppNavbar';
import { 
  Lightbulb, 
  ChevronUp, 
  ChevronDown, 
  Flame, 
  X, 
  Zap, 
  Sparkles, 
  ArrowRight,
  Check,
  BookOpen
} from 'lucide-react';

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
  const usedIdsRef = useRef<Set<string>>(new Set(questions.map((q) => q.questionId)));
  const repo = QuestionRepository.getInstance();

  // Initialize and start the engine
  useEffect(() => {
    audioEngine.playChallengeStart();
    audioEngine.startAmbient('NORMAL');

    const newEngine = new ChallengeEngine(
      config,
      questions,
      playerName,
      {
        onQuestionChanged: (q, idx, total) => {
          // Detect difficulty progression transition
          if (prevDifficultyRef.current && prevDifficultyRef.current !== q.difficulty && idx > 0) {
            setDifficultyBanner(`${prevDifficultyRef.current} → ${q.difficulty}`);
            audioEngine.playDifficultyIncrease();
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
              haptic.warning();
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
              haptic.comboMilestone();
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
          if (result.accuracyPercentage >= 50) {
            audioEngine.playVictoryFanfare();
          } else {
            audioEngine.playDefeatSound();
          }
          onComplete(result);
        },
      },
      (seqIndex) => repo.getStreamQuestion(seqIndex, config, usedIdsRef.current)
    );

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

  // Desktop Keyboard Shortcuts: 1, 2, 3, 4, Space/H (hint), Escape (exit)
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
      <div className="w-full min-h-[100vh] min-h-[100dvh] flex-1 flex items-center justify-center celestial-bg text-slate-400">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 animate-pulse">
            <Sparkles size={24} />
          </div>
          <p className="text-xs font-semibold tracking-wider uppercase text-slate-300">
            Preparing Scripture Challenge...
          </p>
        </div>
      </div>
    );
  }

  const isLowTime = remainingTime <= 5;
  const isUrgent = remainingTime <= 10;
  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="w-full min-h-[100vh] min-h-[100dvh] flex-1 flex flex-col celestial-bg parchment-pattern dark:text-slate-100 text-stone-900 overflow-x-hidden selection:bg-amber-500/30">
      
      {/* 1. TOP APP BAR */}
      <AppNavbar
        isQuizActive={true}
        onNavigate={() => {}}
        onExitQuiz={onExit}
      />

      {/* 2. MAIN QUIZ CONTAINER (Matching Screen 2 & 8) */}
      <main className="w-full max-w-5xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1 flex flex-col justify-between space-y-4 sm:space-y-6">
        
        {/* HUD BAR (Question Progress, Circular Timer, Score & Combo) */}
        <div className="sacred-card rounded-2xl px-4 sm:px-8 py-3.5 border border-amber-500/20 flex items-center justify-between shadow-xl">
          
          {/* Left: Question Number */}
          <div className="text-left">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400">
              Question
            </div>
            <div className="font-mono text-lg sm:text-2xl font-black text-white">
              {questionIndex + 1} <span className="text-slate-500 text-sm sm:text-base font-normal">/ {totalQuestions}</span>
            </div>
          </div>

          {/* Center: Circular Timer Badge (Matching Reference Design) */}
          <div className="relative flex flex-col items-center">
            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border-3 transition-all duration-300 ${
              isLowTime
                ? 'border-rose-500 bg-rose-950/60 shadow-[0_0_20px_rgba(244,63,94,0.6)] animate-pulse'
                : isUrgent
                ? 'border-amber-400 bg-amber-950/60 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'border-amber-400/80 bg-slate-900/90 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
            }`}>
              <span className={`font-mono text-xl sm:text-2xl font-black ${
                isLowTime ? 'text-rose-400' : 'text-amber-300'
              }`}>
                {remainingTime}
              </span>
            </div>
            <div className="text-[9px] uppercase font-bold tracking-widest text-slate-400 mt-1">
              Seconds
            </div>
          </div>

          {/* Right: Score & Combo */}
          <div className="text-right flex items-center gap-4">
            {combo >= 2 && (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 text-xs font-black animate-bounce-short">
                <Flame size={14} className="text-orange-400 fill-orange-400" />
                <span>x{combo}</span>
              </div>
            )}
            <div>
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400">
                Score
              </div>
              <div className={`font-mono text-lg sm:text-2xl font-black text-amber-300 transition-transform ${scoreUpdated ? 'scale-110' : ''}`}>
                {Math.round(score)}
              </div>
            </div>
          </div>
        </div>

        {/* QUESTION CARD (Category Pill + Large Question + Optional Visual) */}
        <div className="sacred-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-amber-500/25 shadow-2xl relative flex-1 flex flex-col justify-center text-center">
          
          {/* Category Capsule Tag */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] sm:text-xs font-bold uppercase tracking-wider mx-auto mb-4">
            <BookOpen size={12} />
            <span>{currentQuestion.book ? `${currentQuestion.book} • ${currentQuestion.difficulty}` : currentQuestion.difficulty}</span>
          </div>

          {/* Question Text */}
          <h2 className="font-display text-lg sm:text-2xl md:text-3xl font-extrabold text-white leading-relaxed max-w-3xl mx-auto mb-4">
            {currentQuestion.question}
          </h2>

          {/* Optional Visual Image Card */}
          {(currentQuestion.imageUrl || currentQuestion.questionType === 'IMAGE') && (
            <div className="my-3 max-w-sm mx-auto rounded-xl overflow-hidden border border-amber-500/30 shadow-md">
              <img 
                src={currentQuestion.imageUrl} 
                alt="Scripture location or artifact" 
                className="w-full h-36 sm:h-44 object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Speed bonus pop badge */}
          {speedBonusAlert && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mx-auto animate-bounce-short mb-2">
              <Zap size={13} className="text-amber-400" />
              <span>+{speedBonusAlert.amount} Speed Bonus!</span>
            </div>
          )}
        </div>

        {/* 2x2 ANSWER OPTIONS GRID (Matching Reference Screen 2 & 8) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {currentQuestion.options.map((option, idx) => {
            const letter = optionLetters[idx] || String.fromCharCode(65 + idx);
            const isSelected = selectedOption === option;
            const isCorrect = evaluatingResult && option === currentQuestion.correctAnswer;
            const isWrong = evaluatingResult && isSelected && !evaluatingResult.isCorrect;

            let cardStyles = 'sacred-card border-amber-500/20 hover:border-amber-400/60 hover:bg-slate-900/80';
            let badgeStyles = 'bg-slate-800/90 text-amber-300 border-slate-700';

            if (evaluatingResult) {
              if (isCorrect) {
                cardStyles = 'bg-emerald-950/70 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400/50';
                badgeStyles = 'bg-emerald-500 text-slate-950 font-black';
              } else if (isWrong) {
                cardStyles = 'bg-rose-950/70 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)] ring-1 ring-rose-500/50';
                badgeStyles = 'bg-rose-500 text-white font-black';
              } else {
                cardStyles = 'opacity-40 bg-slate-950/50 border-slate-800';
              }
            } else if (isSelected) {
              cardStyles = 'border-amber-400 bg-amber-500/15 shadow-[0_0_15px_rgba(245,158,11,0.25)]';
              badgeStyles = 'bg-amber-400 text-slate-950 font-black';
            }

            return (
              <button
                key={option}
                onClick={() => handleSelectOption(option)}
                disabled={selectedOption !== null}
                className={`w-full p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-150 flex items-center gap-3.5 group cursor-pointer ${cardStyles}`}
              >
                {/* Rounded Letter Badge [ A ], [ B ], [ C ], [ D ] */}
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center font-mono font-black text-sm sm:text-base flex-shrink-0 transition-transform group-hover:scale-105 ${badgeStyles}`}>
                  {isCorrect ? <Check size={18} strokeWidth={3} /> : isWrong ? <X size={18} strokeWidth={3} /> : letter}
                </div>

                {/* Option Text */}
                <span className="font-sans font-semibold text-xs sm:text-sm text-slate-100 flex-1 leading-snug">
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        {/* EXPANDABLE HINT DRAWER */}
        <div className="sacred-card rounded-xl border border-amber-500/20 overflow-hidden">
          <button
            onClick={toggleHint}
            className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-bold text-slate-300 hover:text-amber-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Lightbulb size={14} className={isHintOpen ? 'text-amber-400' : 'text-slate-400'} />
              <span>{isHintOpen ? 'Hide Scripture Clue' : 'Reveal Scripture Clue (Press H / Space)'}</span>
            </div>
            {isHintOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {isHintOpen && (
            <div className="px-4 py-3 bg-amber-500/10 border-t border-amber-500/20 text-xs text-amber-200/90 leading-relaxed font-serif italic">
              {getHintText(currentQuestion)}
            </div>
          )}
        </div>

        {/* BOTTOM ACTION BAR (Exit Challenge | Scripture Verse | Next Question) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Exit Challenge Button */}
          <button
            onClick={onExit}
            className="px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-rose-400 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <X size={14} />
            <span>Exit Challenge</span>
          </button>

          {/* Scripture Verse at Bottom */}
          <p className="hidden md:block text-xs font-serif italic text-slate-400 text-center flex-1 px-4">
            "Hide Your word in my heart that I might not sin against You." &mdash; Psalm 119:11
          </p>

          {/* Next Question / Auto-advance Indicator */}
          <button
            onClick={() => {
              if (selectedOption) {
                // Already selected, user tapped Next Question
              }
            }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
              selectedOption
                ? 'gold-button text-slate-950 shadow-md animate-pulse'
                : 'bg-slate-800/60 text-slate-400 border border-slate-700/60'
            }`}
          >
            <span>Next Question</span>
            <ArrowRight size={14} />
          </button>
        </div>

      </main>
    </div>
  );
};
