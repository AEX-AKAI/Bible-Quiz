import React, { useEffect } from 'react';
import { ChallengeResult } from '../../data/models/ChallengeModels';
import confetti from 'canvas-confetti';
import { WebAudioEngine } from '../../platform/audio/WebAudioEngine';
import { HapticService } from '../../platform/haptics/HapticService';
import { 
  Trophy, 
  Flame, 
  Zap, 
  Target, 
  RotateCcw, 
  BookOpen, 
  Award, 
  ArrowRight,
  ChevronRight,
  Home,
  CheckCircle2
} from 'lucide-react';

interface Props {
  result: ChallengeResult;
  onPlayAgain: () => void;
  onViewLeaderboard: () => void;
  onHome: () => void;
  onReviewScripture: () => void;
}

export const ResultsView: React.FC<Props> = ({
  result,
  onPlayAgain,
  onViewLeaderboard,
  onHome,
  onReviewScripture,
}) => {
  const audio = WebAudioEngine.getInstance();
  const haptics = HapticService.getInstance();

  // Determine achievement level
  const isVictory = result.accuracyPercentage >= 70;
  const isModerate = result.accuracyPercentage >= 40 && result.accuracyPercentage < 70;

  const headerTitle = isVictory 
    ? 'VICTORY' 
    : isModerate 
    ? 'CHALLENGE COMPLETE' 
    : 'FAITHFUL EFFORT';

  const headerSubtitle = isVictory
    ? 'Outstanding Scripture mastery, sharp recall, and swift speed!'
    : isModerate
    ? 'A strong round! Keep studying the Word and strengthening your recall.'
    : 'Every question builds deeper biblical knowledge. Keep pressing forward!';

  useEffect(() => {
    if (isVictory) {
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.5 },
          colors: ['#F59E0B', '#FCD34D', '#E0E7FF', '#10B981', '#60A5FA'],
        });
      } catch {}
    }
  }, [isVictory]);

  const reviewCount = result.answerReviews?.length || result.questionsAnswered;

  return (
    <div className="w-full min-h-[100vh] min-h-[100dvh] flex-1 flex flex-col items-center justify-start sm:justify-center celestial-bg parchment-pattern dark:text-slate-100 text-stone-900 overflow-y-auto overflow-x-hidden relative py-6 sm:py-10 px-4 sm:px-6 md:px-8 lg:px-12">
      {/* Radiant Background Aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] sm:w-[48rem] h-80 sm:h-96 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-500/10 blur-3xl pointer-events-none rounded-full" />

      {/* Main Centered Content Container */}
      <div className="w-full max-w-4xl lg:max-w-5xl mx-auto flex flex-col items-center relative z-10 space-y-6 sm:space-y-8 my-auto">
        
        {/* Header Branding & Banner */}
        <header className="text-center w-full max-w-2xl px-2">
          {/* Trophy Badge */}
          <div className="relative inline-block mb-3">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl ring-2 transition-transform hover:scale-105 ${
              isVictory
                ? 'bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 shadow-amber-500/30 ring-amber-300/60'
                : isModerate
                ? 'bg-gradient-to-tr from-slate-700 via-slate-600 to-indigo-500 text-white shadow-indigo-500/25 ring-indigo-400/40'
                : 'bg-gradient-to-tr from-amber-950 via-slate-800 to-slate-900 text-amber-300 shadow-slate-950 ring-amber-500/30'
            }`}>
              {isVictory ? <Trophy className="w-8 h-8 sm:w-10 sm:h-10 animate-bounce-short" /> : isModerate ? <Award className="w-8 h-8 sm:w-10 sm:h-10" /> : <BookOpen className="w-8 h-8 sm:w-10 sm:h-10" />}
            </div>
            <div className="absolute -inset-1 rounded-2xl sm:rounded-3xl bg-amber-400/20 blur-sm -z-10" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-300 text-[11px] sm:text-xs font-mono font-bold tracking-widest uppercase mb-2">
            <span>✦ BIBLE QUIZ RESULTS ✦</span>
            <span>•</span>
            <span>CHALLENGE #{result.challengeId}</span>
            <span>•</span>
            <span>{result.durationSeconds}S</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight dark:text-white text-stone-900">
            {headerTitle}
          </h1>

          <p className="text-xs sm:text-sm md:text-base dark:text-slate-300 text-stone-600 max-w-lg mx-auto mt-2 leading-relaxed">
            {headerSubtitle}
          </p>
        </header>

        {/* Primary Final Score Card */}
        <section className="sacred-card w-full rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden border border-amber-500/20">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-amber-500/15 blur-3xl pointer-events-none rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-yellow-500/10 blur-3xl pointer-events-none rounded-full" />

          {/* Central Score Callout */}
          <div className="text-center pb-6 sm:pb-8 border-b dark:border-slate-800/90 border-stone-200">
            <span className="text-xs sm:text-sm uppercase tracking-widest dark:text-slate-400 text-stone-500 font-bold font-mono">
              FINAL SCORE
            </span>
            <div className="font-mono text-5xl sm:text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200 tracking-tight my-1 sm:my-2 drop-shadow-md score-updated">
              {result.finalScore.toFixed(1)}
            </div>
            <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-amber-600 dark:text-amber-400/90 font-medium tracking-wide">
              <CheckCircle2 size={13} className="text-emerald-500" />
              <span>Verified Fair Challenge • Seed #{result.seed}</span>
            </div>
          </div>

          {/* Statistics Display (Desktop: 4 Columns, Mobile: 2x2 Grid) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5 pt-6 sm:pt-8">
            {/* Accuracy */}
            <div className="p-3.5 sm:p-4 rounded-xl dark:bg-slate-900/90 bg-white/95 border dark:border-slate-800 border-stone-200 text-center shadow-sm flex flex-col justify-center transition-all hover:border-emerald-500/40">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2">
                <Target size={18} />
              </div>
              <div className="font-mono text-xl sm:text-2xl md:text-3xl font-bold dark:text-white text-stone-900">
                {result.accuracyPercentage}%
              </div>
              <div className="text-[11px] sm:text-xs dark:text-slate-400 text-stone-500 font-medium mt-0.5">Accuracy</div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                {result.correctAnswers}/{result.questionsAnswered} Correct
              </div>
            </div>

            {/* Questions Answered */}
            <div className="p-3.5 sm:p-4 rounded-xl dark:bg-slate-900/90 bg-white/95 border dark:border-slate-800 border-stone-200 text-center shadow-sm flex flex-col justify-center transition-all hover:border-amber-500/40">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center mx-auto mb-2">
                <BookOpen size={18} />
              </div>
              <div className="font-mono text-xl sm:text-2xl md:text-3xl font-bold text-amber-600 dark:text-amber-300">
                {result.questionsAnswered}
              </div>
              <div className="text-[11px] sm:text-xs dark:text-slate-400 text-stone-500 font-medium mt-0.5">Questions</div>
              <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-1">
                {result.averageResponseTimeSeconds > 0 ? `${result.averageResponseTimeSeconds.toFixed(1)}s avg` : 'Completed'}
              </div>
            </div>

            {/* Best Combo */}
            <div className="p-3.5 sm:p-4 rounded-xl dark:bg-slate-900/90 bg-white/95 border dark:border-slate-800 border-stone-200 text-center shadow-sm flex flex-col justify-center transition-all hover:border-amber-500/40">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center mx-auto mb-2">
                <Flame size={18} />
              </div>
              <div className="font-mono text-xl sm:text-2xl md:text-3xl font-bold text-amber-600 dark:text-amber-300">
                ×{result.bestCombo}
              </div>
              <div className="text-[11px] sm:text-xs dark:text-slate-400 text-stone-500 font-medium mt-0.5">Best Combo</div>
              <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-1">
                Streak Multiplier
              </div>
            </div>

            {/* Speed Bonus */}
            <div className="p-3.5 sm:p-4 rounded-xl dark:bg-slate-900/90 bg-white/95 border dark:border-slate-800 border-stone-200 text-center shadow-sm flex flex-col justify-center transition-all hover:border-yellow-500/40">
              <div className="w-8 h-8 rounded-lg bg-yellow-500/15 text-yellow-500 dark:text-yellow-400 flex items-center justify-center mx-auto mb-2">
                <Zap size={18} />
              </div>
              <div className="font-mono text-xl sm:text-2xl md:text-3xl font-bold text-yellow-600 dark:text-yellow-300">
                +{result.fastAnswersCount}
              </div>
              <div className="text-[11px] sm:text-xs dark:text-slate-400 text-stone-500 font-medium mt-0.5">Speed Bonus</div>
              <div className="text-[10px] text-yellow-600 dark:text-yellow-400 font-semibold mt-1">
                Rapid Solves
              </div>
            </div>
          </div>
        </section>

        {/* Action Controls Area */}
        <section className="w-full max-w-3xl lg:max-w-4xl flex flex-col items-center space-y-4 pt-1">
          
          {/* Primary Action: REVIEW SCRIPTURE (Opens Dedicated Page) */}
          <button
            onClick={() => {
              audio.playTabSound();
              haptics.mediumTap();
              onReviewScripture();
            }}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-400/25 to-yellow-500/20 hover:from-amber-500/30 hover:via-amber-400/35 hover:to-yellow-500/30 border-2 border-amber-500/40 hover:border-amber-400 text-stone-900 dark:text-amber-200 font-bold text-sm sm:text-base flex items-center justify-between shadow-xl shadow-amber-500/10 transition-all active:scale-[0.99] group min-h-[56px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 dark:text-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen size={20} />
              </div>
              <div className="text-left">
                <div className="text-sm sm:text-base font-extrabold dark:text-white text-stone-900">
                  Review Scripture Questions
                </div>
                <div className="text-xs text-amber-600 dark:text-amber-400/80 font-medium">
                  {reviewCount} questions • Biblical context & explanations
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-amber-600 dark:text-amber-300 font-bold text-xs sm:text-sm pl-2">
              <span>Inspect</span>
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Secondary Actions: PLAY AGAIN, LEADERBOARD, HOME */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Play Again (Primary Accent) */}
            <button
              onClick={() => {
                audio.playActionSound();
                haptics.mediumTap();
                onPlayAgain();
              }}
              className="gold-button py-3.5 px-5 rounded-xl flex items-center justify-center gap-2.5 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all active:scale-95 min-h-[48px]"
            >
              <RotateCcw size={17} />
              <span>Play Again</span>
            </button>

            {/* Leaderboard */}
            <button
              onClick={() => {
                audio.playButtonTap();
                haptics.lightTap();
                onViewLeaderboard();
              }}
              className="py-3.5 px-4 rounded-xl dark:bg-slate-900/90 bg-white hover:dark:bg-slate-800 hover:bg-stone-50 border dark:border-slate-800 border-stone-200 dark:text-slate-200 text-stone-800 font-bold text-xs sm:text-sm uppercase tracking-wider transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2 min-h-[48px]"
            >
              <Trophy size={16} className="text-amber-500 dark:text-amber-400" />
              <span>Leaderboard</span>
            </button>

            {/* Home */}
            <button
              onClick={() => {
                audio.playButtonTap();
                haptics.lightTap();
                onHome();
              }}
              className="py-3.5 px-4 rounded-xl dark:bg-slate-900/90 bg-white hover:dark:bg-slate-800 hover:bg-stone-50 border dark:border-slate-800 border-stone-200 dark:text-slate-200 text-stone-800 font-bold text-xs sm:text-sm uppercase tracking-wider transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2 min-h-[48px]"
            >
              <Home size={16} />
              <span>Home</span>
            </button>
          </div>

        </section>

      </div>
    </div>
  );
};
