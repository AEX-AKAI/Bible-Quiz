import React, { useState, useMemo } from 'react';
import { ChallengeResult } from '../../data/models/ChallengeModels';
import { WebAudioEngine } from '../../platform/audio/WebAudioEngine';
import { HapticService } from '../../platform/haptics/HapticService';
import { AppNavbar } from '../../components/AppNavbar';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Check, 
  X, 
  Bookmark,
  Layers,
  ChevronDown
} from 'lucide-react';

interface Props {
  result: ChallengeResult;
  onBack: () => void;
  onPlayAgain?: () => void;
  onHome?: () => void;
  onNavigate?: (tab: 'HOME' | 'CHALLENGES' | 'LEADERBOARD' | 'SETTINGS') => void;
  onOpenProfile?: () => void;
}

type FilterMode = 'ALL' | 'CORRECT' | 'INCORRECT';

export const ReviewScriptureView: React.FC<Props> = ({
  result,
  onBack,
  onPlayAgain,
  onHome,
  onNavigate,
  onOpenProfile,
}) => {
  const [filter, setFilter] = useState<FilterMode>('ALL');

  const audio = WebAudioEngine.getInstance();
  const haptics = HapticService.getInstance();

  const totalQuestions = result.answerReviews.length;
  const correctCount = useMemo(
    () => result.answerReviews.filter((r) => r.isCorrect).length,
    [result.answerReviews]
  );
  const incorrectCount = totalQuestions - correctCount;

  const filteredReviews = useMemo(() => {
    if (filter === 'CORRECT') {
      return result.answerReviews.filter((r) => r.isCorrect);
    }
    if (filter === 'INCORRECT') {
      return result.answerReviews.filter((r) => !r.isCorrect);
    }
    return result.answerReviews;
  }, [result.answerReviews, filter]);

  const handleBack = () => {
    audio.playButtonTap();
    haptics.lightTap();
    onBack();
  };

  return (
    <div className="w-full min-h-[100vh] min-h-[100dvh] flex-1 flex flex-col celestial-bg parchment-pattern dark:text-slate-100 text-stone-900 overflow-x-hidden selection:bg-amber-500/30 pb-12">
      
      {/* 1. TOP NAVBAR */}
      <AppNavbar
        activeTab="HOME"
        onNavigate={(tab) => {
          if (tab === 'HOME' && onHome) onHome();
          else if (tab === 'CHALLENGES' && onPlayAgain) onPlayAgain();
          else if (onNavigate) onNavigate(tab);
        }}
        onOpenProfile={onOpenProfile}
      />

      {/* 2. SUBHEADER: BACK TO RESULTS & TITLE (Screen 4 & 10) */}
      <div className="w-full border-b border-amber-500/15 bg-slate-950/60 dark:bg-slate-950/60 bg-white/70 backdrop-blur-md sticky top-[57px] sm:top-[65px] z-30">
        <div className="w-full max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          
          {/* Back to Results Button */}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-amber-500/30 text-amber-300 font-bold text-xs sm:text-sm transition-colors active:scale-95 shadow-sm"
          >
            <ArrowLeft size={16} />
            <span>Back to Results</span>
          </button>

          {/* Centered Page Title */}
          <div className="text-center flex-1 hidden sm:block">
            <h1 className="font-display text-lg font-bold text-white tracking-wide">
              Review Scripture
            </h1>
            <p className="text-xs text-slate-400">
              Review the questions and answers from this challenge.
            </p>
          </div>

          {/* Right Question Count Pill */}
          <div className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold">
            {totalQuestions} Questions
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT: 2-COLUMN DESKTOP / STACKED MOBILE (Screen 4 & 10) */}
      <main className="w-full max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col">
        
        {/* Mobile Filter Selector */}
        <div className="md:hidden flex items-center gap-2 mb-4 sacred-card p-1.5 rounded-xl border border-amber-500/20">
          <button
            onClick={() => setFilter('ALL')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
              filter === 'ALL' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400'
            }`}
          >
            All ({totalQuestions})
          </button>
          <button
            onClick={() => setFilter('CORRECT')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
              filter === 'CORRECT' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400'
            }`}
          >
            Correct ({correctCount})
          </button>
          <button
            onClick={() => setFilter('INCORRECT')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
              filter === 'INCORRECT' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-slate-400'
            }`}
          >
            Incorrect ({incorrectCount})
          </button>
        </div>

        {/* 2-COLUMN GRID (Desktop Sidebar + Content) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start flex-1">
          
          {/* LEFT SIDEBAR: Filters (Desktop) */}
          <aside className="hidden md:block md:col-span-4 lg:col-span-3 space-y-2 sacred-card p-3 rounded-2xl border border-amber-500/20 sticky top-32">
            <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              Filter Questions
            </div>

            <button
              onClick={() => setFilter('ALL')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                filter === 'ALL'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-2">
                <Layers size={14} />
                <span>All Questions</span>
              </div>
              <span className="font-mono">{totalQuestions}</span>
            </button>

            <button
              onClick={() => setFilter('CORRECT')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                filter === 'CORRECT'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>Correct</span>
              </div>
              <span className="font-mono text-emerald-400">{correctCount}</span>
            </button>

            <button
              onClick={() => setFilter('INCORRECT')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                filter === 'INCORRECT'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-2">
                <XCircle size={14} className="text-rose-400" />
                <span>Incorrect</span>
              </div>
              <span className="font-mono text-rose-400">{incorrectCount}</span>
            </button>
          </aside>

          {/* RIGHT / MAIN CONTENT: Question Cards List */}
          <div className="md:col-span-8 lg:col-span-9 space-y-4">
            {filteredReviews.length === 0 ? (
              <div className="sacred-card rounded-2xl p-8 text-center text-slate-400 border border-amber-500/20">
                <p className="text-sm font-semibold">No questions in this category.</p>
              </div>
            ) : (
              filteredReviews.map((review, idx) => (
                <div
                  key={review.questionId || idx}
                  className="sacred-card rounded-2xl p-5 sm:p-6 border border-amber-500/20 shadow-lg space-y-4"
                >
                  {/* Top Card Line: Question Number + Status Badge */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                    <span className="font-display font-bold text-sm sm:text-base text-white">
                      Question {review.questionNumber}
                    </span>

                    {/* Status Badge */}
                    {review.isCorrect ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
                        <Check size={13} strokeWidth={3} />
                        <span>Correct</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/70 border border-rose-500/40 text-rose-400 text-xs font-bold">
                        <X size={13} strokeWidth={3} />
                        <span>Incorrect</span>
                      </span>
                    )}
                  </div>

                  {/* Question Text & Optional Image */}
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <p className="font-sans font-medium text-sm sm:text-base text-slate-100 leading-relaxed flex-1">
                      {review.questionText}
                    </p>

                    {review.imageUrl && (
                      <img 
                        src={review.imageUrl} 
                        alt="Question context" 
                        className="w-full sm:w-28 h-24 object-cover rounded-xl border border-amber-500/30 flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    )}
                  </div>

                  {/* Answer Comparison */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {/* User's Answer */}
                    <div className={`p-3 rounded-xl border ${
                      review.isCorrect
                        ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                        : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
                    }`}>
                      <span className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">
                        Your Answer:
                      </span>
                      <span className="font-semibold text-sm">
                        {review.selectedAnswer}
                      </span>
                    </div>

                    {/* Correct Answer */}
                    <div className="p-3 rounded-xl border bg-slate-900/80 border-slate-800 text-emerald-300">
                      <span className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">
                        Correct Answer:
                      </span>
                      <span className="font-semibold text-sm">
                        {review.correctAnswer}
                      </span>
                    </div>
                  </div>

                  {/* Scripture Citation & Explanation */}
                  <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">Scripture:</span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold">
                        <Bookmark size={11} />
                        <span>{review.scriptureReference}</span>
                      </span>
                    </div>

                    {review.explanation && (
                      <p className="text-xs text-slate-300 font-serif italic leading-relaxed pl-1">
                        "{review.explanation}"
                      </p>
                    )}
                  </div>

                </div>
              ))
            )}
          </div>

        </div>

      </main>
    </div>
  );
};
