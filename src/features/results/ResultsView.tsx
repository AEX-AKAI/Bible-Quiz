import React, { useEffect } from 'react';
import { ChallengeResult } from '../../data/models/ChallengeModels';
import confetti from 'canvas-confetti';
import { WebAudioEngine } from '../../platform/audio/WebAudioEngine';
import { HapticService } from '../../platform/haptics/HapticService';
import { AppNavbar } from '../../components/AppNavbar';
import { 
  Trophy, 
  Flame, 
  Zap, 
  Target, 
  RotateCcw, 
  BookOpen, 
  ArrowRight,
  Home,
  CheckCircle2,
  ShieldCheck,
  Award
} from 'lucide-react';

interface Props {
  result: ChallengeResult;
  onPlayAgain: () => void;
  onViewLeaderboard: () => void;
  onHome: () => void;
  onReviewScripture: () => void;
  onOpenSettings?: () => void;
  onOpenProfile?: () => void;
}

export const ResultsView: React.FC<Props> = ({
  result,
  onPlayAgain,
  onViewLeaderboard,
  onHome,
  onReviewScripture,
  onOpenSettings,
  onOpenProfile,
}) => {
  const audio = WebAudioEngine.getInstance();
  const haptics = HapticService.getInstance();

  const isVictory = result.accuracyPercentage >= 70;
  const isModerate = result.accuracyPercentage >= 40 && result.accuracyPercentage < 70;

  const headerTitle = isVictory 
    ? 'VICTORY' 
    : isModerate 
    ? 'CHALLENGE COMPLETE' 
    : 'FAITHFUL EFFORT';

  const headerSubtitle = isVictory
    ? 'Outstanding Scripture mastery and fast recall!'
    : isModerate
    ? 'A strong round! Keep studying the Word and strengthening your recall.'
    : 'Every question builds deeper biblical knowledge. Keep pressing forward!';

  useEffect(() => {
    if (isVictory) {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#F59E0B', '#FCD34D', '#E0E7FF', '#10B981', '#60A5FA'],
        });
      } catch {}
    }
  }, [isVictory]);

  const questionsCount = result.answerReviews?.length || result.questionsAnswered;

  return (
    <div className="w-full min-h-[100vh] min-h-[100dvh] flex-1 flex flex-col celestial-bg parchment-pattern dark:text-slate-100 text-stone-900 overflow-x-hidden selection:bg-amber-500/30">
      
      {/* 1. TOP NAVBAR */}
      <AppNavbar
        activeTab="HOME"
        onNavigate={(tab) => {
          if (tab === 'HOME') onHome();
          else if (tab === 'CHALLENGES') onPlayAgain();
          else if (tab === 'LEADERBOARD') onViewLeaderboard();
          else if (tab === 'SETTINGS' && onOpenSettings) onOpenSettings();
        }}
        onOpenProfile={onOpenProfile}
      />

      {/* 2. MAIN RESULTS VIEWPORT (Screen 3 & 9 from Reference Image) */}
      <main className="w-full max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex-1 flex flex-col justify-between items-center text-center relative space-y-6 sm:space-y-8">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] sm:w-[48rem] h-80 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />

        {/* TOP CHALLENGE BADGE */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold tracking-widest uppercase shadow-sm">
          <span>✦ CHALLENGE #{result.challengeId} &bull; {result.durationSeconds}S ✦</span>
        </div>

        {/* LAUREL WREATH & HEADLINE */}
        <div className="flex flex-col items-center justify-center space-y-2 max-w-xl mx-auto">
          {/* Golden Laurel Emblem */}
          <div className="flex items-center justify-center gap-4 text-amber-400">
            {/* Left Laurel Branch */}
            <svg width="36" height="48" viewBox="0 0 36 48" fill="currentColor" className="opacity-90">
              <path d="M18 4C14 10 10 18 10 28C10 38 18 44 18 44C18 44 12 36 12 28C12 20 16 12 18 4Z" />
              <circle cx="8" cy="14" r="3" />
              <circle cx="6" cy="24" r="3" />
              <circle cx="8" cy="34" r="3" />
            </svg>

            {/* Trophy Icon */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center shadow-2xl shadow-amber-500/30 ring-2 ring-amber-300/60">
              <Trophy className="w-8 h-8 sm:w-10 sm:h-10 animate-bounce-short" />
            </div>

            {/* Right Laurel Branch */}
            <svg width="36" height="48" viewBox="0 0 36 48" fill="currentColor" className="opacity-90 transform scale-x-[-1]">
              <path d="M18 4C14 10 10 18 10 28C10 38 18 44 18 44C18 44 12 36 12 28C12 20 16 12 18 4Z" />
              <circle cx="8" cy="14" r="3" />
              <circle cx="6" cy="24" r="3" />
              <circle cx="8" cy="34" r="3" />
            </svg>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
            {headerTitle}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            {headerSubtitle}
          </p>
        </div>

        {/* CENTER FINAL SCORE CARD */}
        <div className="sacred-card w-full rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-amber-500/25 shadow-2xl relative overflow-hidden">
          <div className="text-center space-y-1">
            <span className="text-xs font-mono font-bold tracking-[0.25em] text-slate-400 uppercase">
              FINAL SCORE
            </span>
            <div className="font-mono text-5xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-300 to-yellow-400 tracking-tight drop-shadow-lg">
              {result.finalScore.toFixed(1)}
            </div>
            
            {/* Anti-Cheat Verified Pill */}
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                <ShieldCheck size={13} />
                <span>Verified Against Anti-Cheat Engine</span>
              </span>
            </div>
          </div>
        </div>

        {/* 4 METRIC CARDS (Desktop: 4 columns in a row, Mobile: 2x2 grid) */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {/* Metric 1: Accuracy */}
          <div className="sacred-card p-4 rounded-2xl border border-amber-500/20 text-center">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mx-auto mb-2">
              <Target size={18} />
            </div>
            <div className="font-mono text-xl sm:text-2xl font-black text-white">
              {result.accuracyPercentage}%
            </div>
            <div className="text-[11px] text-slate-400 uppercase font-bold mt-0.5">
              Accuracy
            </div>
          </div>

          {/* Metric 2: Questions */}
          <div className="sacred-card p-4 rounded-2xl border border-amber-500/20 text-center">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mx-auto mb-2">
              <BookOpen size={18} />
            </div>
            <div className="font-mono text-xl sm:text-2xl font-black text-white">
              {questionsCount}
            </div>
            <div className="text-[11px] text-slate-400 uppercase font-bold mt-0.5">
              Questions
            </div>
          </div>

          {/* Metric 3: Best Combo */}
          <div className="sacred-card p-4 rounded-2xl border border-amber-500/20 text-center">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mx-auto mb-2">
              <Flame size={18} />
            </div>
            <div className="font-mono text-xl sm:text-2xl font-black text-amber-300">
              x{result.bestCombo}
            </div>
            <div className="text-[11px] text-slate-400 uppercase font-bold mt-0.5">
              Best Combo
            </div>
          </div>

          {/* Metric 4: Speed Bonus */}
          <div className="sacred-card p-4 rounded-2xl border border-amber-500/20 text-center">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mx-auto mb-2">
              <Zap size={18} />
            </div>
            <div className="font-mono text-xl sm:text-2xl font-black text-amber-300">
              +{result.fastAnswersCount}
            </div>
            <div className="text-[11px] text-slate-400 uppercase font-bold mt-0.5">
              Speed Bonus
            </div>
          </div>
        </div>

        {/* SCRIPTURE QUOTE CARD */}
        <div className="w-full sacred-card p-4 sm:p-5 rounded-2xl border border-amber-500/20 text-center">
          <p className="font-serif italic text-xs sm:text-sm text-amber-200/90 leading-relaxed max-w-2xl mx-auto">
            "All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness."
          </p>
          <span className="block text-[11px] text-amber-400 font-bold mt-1">
            &mdash; 2 Timothy 3:16
          </span>
        </div>

        {/* PRIMARY CTA ACTIONS (Review Scripture + Play Again + Home) */}
        <div className="w-full max-w-md mx-auto space-y-3">
          {/* Primary Big Golden Button: Review Scripture */}
          <button
            onClick={onReviewScripture}
            className="w-full gold-button py-4 px-6 rounded-2xl flex items-center justify-center gap-3 text-slate-950 font-black text-sm sm:text-base uppercase tracking-wider shadow-xl shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <BookOpen size={20} />
            <span>Review Scripture</span>
            <ArrowRight size={18} />
          </button>

          {/* Secondary Action Row: Play Again & Home */}
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={onPlayAgain}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw size={14} />
              <span>Play Again</span>
            </button>

            <button
              onClick={onHome}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <Home size={14} />
              <span>Home</span>
            </button>
          </div>
        </div>

        {/* FOUNDATION FOOTER */}
        <footer className="w-full text-center pt-4 border-t border-amber-500/10">
          <div className="text-[9px] tracking-[0.2em] font-extrabold uppercase text-slate-500">
            TESTIFY FOUNDATION &bull; FAITH &bull; KNOWLEDGE &bull; A BRIGHTER TOMORROW
          </div>
        </footer>

      </main>
    </div>
  );
};
