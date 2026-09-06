import React, { useState, useMemo } from 'react';
import { ChallengeResult, AnswerReviewItem } from '../../data/models/ChallengeModels';
import { WebAudioEngine } from '../../platform/audio/WebAudioEngine';
import { HapticService } from '../../platform/haptics/HapticService';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Target, 
  Sparkles, 
  RotateCcw,
  Check,
  X,
  Clock,
  Award,
  Layers,
  Image as ImageIcon,
  ArrowUp
} from 'lucide-react';

interface Props {
  result: ChallengeResult;
  onBack: () => void;
  onPlayAgain?: () => void;
}

type FilterMode = 'ALL' | 'CORRECT' | 'INCORRECT';

export const ReviewScriptureView: React.FC<Props> = ({
  result,
  onBack,
  onPlayAgain,
}) => {
  const [filter, setFilter] = useState<FilterMode>('ALL');
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full min-h-[100dvh] flex-1 flex flex-col celestial-bg parchment-pattern dark:text-slate-100 text-stone-900 overflow-y-auto selection:bg-amber-500/30">
      {/* 1. STICKY TOP HEADER */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl dark:bg-[#080D1A]/90 bg-[#FAF7F0]/90 border-b dark:border-amber-500/15 border-stone-200 transition-colors pt-[max(8px,var(--safe-area-top))] shadow-md">
        <div className="w-full max-w-[1040px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="group flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl dark:bg-slate-900/80 bg-white hover:dark:bg-slate-800 hover:bg-stone-100 border dark:border-slate-800 border-stone-200 text-xs sm:text-sm font-bold dark:text-amber-300 text-amber-700 transition-all active:scale-95 shadow-sm"
            aria-label="Return to score summary"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            <span className="hidden xs:inline">Back to Score</span>
            <span className="xs:hidden">Score</span>
          </button>

          {/* Centered Page Title */}
          <div className="text-center flex-1 px-2">
            <h1 className="font-display text-base sm:text-xl font-bold tracking-tight dark:text-white text-stone-900 truncate">
              Review Scripture
            </h1>
            <p className="text-[11px] sm:text-xs dark:text-slate-400 text-stone-500 hidden sm:block">
              Challenge #{result.challengeId} • {result.questionsAnswered} Questions • {result.accuracyPercentage}% Accuracy
            </p>
          </div>

          {/* Quick Score Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl dark:bg-amber-500/10 bg-amber-100/80 border dark:border-amber-500/20 border-amber-300 text-xs font-mono font-bold dark:text-amber-300 text-amber-800">
            <Sparkles size={13} className="text-amber-500 hidden sm:inline" />
            <span>{result.finalScore.toFixed(1)} pts</span>
          </div>
        </div>
      </header>

      {/* 2. MAIN SCROLLABLE CONTENT */}
      <main className="w-full max-w-[1040px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 flex flex-col space-y-6">
        {/* Banner & Filter Overview */}
        <div className="sacred-card rounded-2xl p-4 sm:p-6 shadow-xl border dark:border-amber-500/20 border-amber-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider dark:bg-amber-500/15 bg-amber-100 text-amber-700 dark:text-amber-300 mb-2">
                <BookOpen size={13} />
                <span>Scripture Knowledge Breakdown</span>
              </div>
              <h2 className="font-display text-lg sm:text-2xl font-bold dark:text-white text-stone-900">
                Detailed Question Analysis
              </h2>
              <p className="text-xs sm:text-sm dark:text-slate-400 text-stone-600 mt-1 max-w-xl">
                Review your selections, study biblical citations, and deepen your theological understanding through scripture commentary.
              </p>
            </div>

            {/* Quick Stats Pills */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <div className="px-3 py-2 rounded-xl dark:bg-slate-900/80 bg-white border dark:border-slate-800 border-stone-200 text-center flex-1 sm:flex-initial min-w-[75px]">
                <div className="text-base sm:text-lg font-bold font-mono dark:text-white text-stone-900">{totalQuestions}</div>
                <div className="text-[10px] uppercase font-bold dark:text-slate-400 text-stone-500">Total</div>
              </div>
              <div className="px-3 py-2 rounded-xl dark:bg-emerald-950/40 bg-emerald-50 border border-emerald-500/30 text-center flex-1 sm:flex-initial min-w-[75px]">
                <div className="text-base sm:text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">{correctCount}</div>
                <div className="text-[10px] uppercase font-bold text-emerald-600/80 dark:text-emerald-400/80">Correct</div>
              </div>
              <div className="px-3 py-2 rounded-xl dark:bg-rose-950/40 bg-rose-50 border border-rose-500/30 text-center flex-1 sm:flex-initial min-w-[75px]">
                <div className="text-base sm:text-lg font-bold font-mono text-rose-600 dark:text-rose-400">{incorrectCount}</div>
                <div className="text-[10px] uppercase font-bold text-rose-600/80 dark:text-rose-400/80">Incorrect</div>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="mt-5 pt-4 border-t dark:border-slate-800/80 border-stone-200/80 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold dark:text-slate-400 text-stone-500 mr-1 flex items-center gap-1.5">
              <Layers size={14} /> Filter:
            </span>
            <button
              onClick={() => {
                audio.playButtonTap();
                setFilter('ALL');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === 'ALL'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'dark:bg-slate-900 bg-white hover:dark:bg-slate-800 hover:bg-stone-100 dark:text-slate-300 text-stone-700 border dark:border-slate-800 border-stone-200'
              }`}
            >
              All Questions ({totalQuestions})
            </button>
            <button
              onClick={() => {
                audio.playButtonTap();
                setFilter('CORRECT');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                filter === 'CORRECT'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'dark:bg-slate-900 bg-white hover:dark:bg-slate-800 hover:bg-stone-100 text-emerald-600 dark:text-emerald-400 border dark:border-slate-800 border-stone-200'
              }`}
            >
              <Check size={13} />
              Correct ({correctCount})
            </button>
            <button
              onClick={() => {
                audio.playButtonTap();
                setFilter('INCORRECT');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                filter === 'INCORRECT'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'dark:bg-slate-900 bg-white hover:dark:bg-slate-800 hover:bg-stone-100 text-rose-600 dark:text-rose-400 border dark:border-slate-800 border-stone-200'
              }`}
            >
              <X size={13} />
              Incorrect ({incorrectCount})
            </button>
          </div>
        </div>

        {/* Empty State */}
        {filteredReviews.length === 0 && (
          <div className="sacred-card rounded-2xl p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto text-xl">
              ✝
            </div>
            <h3 className="font-display text-lg font-bold dark:text-white text-stone-900">
              No questions found for this filter
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Switch back to all questions to inspect the full challenge review.
            </p>
            <button
              onClick={() => setFilter('ALL')}
              className="px-4 py-2 rounded-xl gold-button text-slate-950 font-bold text-xs inline-flex items-center gap-2"
            >
              Show All Questions
            </button>
          </div>
        )}

        {/* Question Cards List */}
        <div className="space-y-4">
          {filteredReviews.map((rev, idx) => {
            const isCorrect = rev.isCorrect;
            const hasImage = Boolean(rev.imageUrl);

            return (
              <article
                key={rev.questionId || idx}
                className={`sacred-card rounded-2xl p-4 sm:p-6 transition-all duration-200 relative overflow-hidden border ${
                  isCorrect
                    ? 'dark:border-emerald-500/30 border-emerald-400/40 dark:hover:border-emerald-500/50 hover:border-emerald-500/60'
                    : 'dark:border-rose-500/30 border-rose-400/40 dark:hover:border-rose-500/50 hover:border-rose-500/60'
                }`}
              >
                {/* Accent Top Color Stripe */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${
                    isCorrect ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-rose-500 to-amber-500'
                  }`}
                />

                {/* Question Header Bar */}
                <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg dark:bg-slate-900/90 bg-stone-100 border dark:border-slate-800 border-stone-200 dark:text-amber-300 text-amber-700">
                      QUESTION {rev.questionNumber}
                    </span>
                    {hasImage && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-500 dark:text-amber-400">
                        <ImageIcon size={13} /> Visual
                      </span>
                    )}
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-2">
                    {rev.responseTimeSeconds > 0 && (
                      <span className="text-[11px] font-mono dark:text-slate-400 text-stone-500 flex items-center gap-1">
                        <Clock size={12} />
                        {rev.responseTimeSeconds.toFixed(1)}s
                      </span>
                    )}
                    {rev.pointsEarned > 0 && (
                      <span className="text-[11px] font-mono font-bold dark:text-amber-300 text-amber-700 px-2 py-0.5 rounded-md dark:bg-amber-500/10 bg-amber-100">
                        +{rev.pointsEarned.toFixed(0)} pts
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        isCorrect
                          ? 'dark:bg-emerald-950/60 bg-emerald-100 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30'
                          : 'dark:bg-rose-950/60 bg-rose-100 text-rose-600 dark:text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 size={14} className="text-emerald-500" />
                          <span>CORRECT</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={14} className="text-rose-500" />
                          <span>INCORRECT</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Question Text */}
                <h3 className="text-base sm:text-lg font-bold dark:text-white text-stone-900 leading-snug mb-3.5">
                  {rev.questionText}
                </h3>

                {/* Visual Image if applicable */}
                {hasImage && rev.imageUrl && !failedImages[rev.questionNumber] && (
                  <div className="my-3.5 rounded-xl overflow-hidden border dark:border-slate-800 border-stone-200 max-w-lg mx-auto bg-slate-950">
                    <img
                      src={rev.imageUrl}
                      alt={rev.questionText}
                      onLoad={() => setLoadedImages((prev) => ({ ...prev, [rev.questionNumber]: true }))}
                      onError={() => setFailedImages((prev) => ({ ...prev, [rev.questionNumber]: true }))}
                      className={`w-full max-h-56 sm:max-h-64 object-cover object-center transition-opacity duration-300 ${
                        loadedImages[rev.questionNumber] ? 'opacity-100' : 'opacity-80'
                      }`}
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Answer Comparison Section */}
                <div className="mt-3.5 pt-3.5 border-t dark:border-slate-800/80 border-stone-200/80 space-y-2.5">
                  {/* Your Answer */}
                  <div
                    className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 ${
                      isCorrect
                        ? 'dark:bg-emerald-950/20 bg-emerald-50/60 border-emerald-500/30'
                        : 'dark:bg-rose-950/20 bg-rose-50/60 border-rose-500/30'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase tracking-wider font-bold dark:text-slate-400 text-stone-500">
                        Your Answer:
                      </span>
                      <span
                        className={`text-sm font-bold ${
                          isCorrect
                            ? 'text-emerald-600 dark:text-emerald-300'
                            : 'text-rose-600 dark:text-rose-400 line-through decoration-rose-500/50'
                        }`}
                      >
                        {rev.selectedAnswer || '(Timed Out / No Answer)'}
                      </span>
                    </div>
                    {isCorrect ? (
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <Check size={13} /> Accurate recall
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-rose-500 dark:text-rose-400 flex items-center gap-1">
                        <X size={13} /> Missed question
                      </span>
                    )}
                  </div>

                  {/* Correct Answer (Highlighted when user missed) */}
                  {!isCorrect && (
                    <div className="p-3 rounded-xl dark:bg-emerald-950/30 bg-emerald-50/80 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase tracking-wider font-bold text-emerald-700 dark:text-emerald-400">
                          Correct Answer:
                        </span>
                        <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                          {rev.correctAnswer}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        Biblical truth
                      </span>
                    </div>
                  )}
                </div>

                {/* Theological Scripture Reference & Commentary Box */}
                {(rev.scriptureReference || rev.explanation) && (
                  <div className="mt-3.5 p-3.5 rounded-xl dark:bg-slate-900/90 bg-amber-50/70 border dark:border-amber-500/20 border-amber-200/80 text-xs leading-relaxed space-y-1">
                    {rev.scriptureReference && (
                      <div className="flex items-center gap-1.5 font-bold dark:text-amber-300 text-amber-800">
                        <BookOpen size={14} className="text-amber-500 shrink-0" />
                        <span>Scripture Reference: {rev.scriptureReference}</span>
                      </div>
                    )}
                    {rev.explanation && (
                      <p className="dark:text-slate-300 text-stone-700 pt-0.5 leading-relaxed">
                        {rev.explanation}
                      </p>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Bottom Actions Bar */}
        <div className="pt-6 pb-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t dark:border-slate-800 border-stone-200">
          <button
            onClick={handleBack}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl dark:bg-slate-900/90 bg-white hover:dark:bg-slate-800 hover:bg-stone-100 border dark:border-slate-800 border-stone-200 dark:text-slate-200 text-stone-800 font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-98 shadow-sm"
          >
            <ArrowLeft size={16} />
            <span>Return to Score</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {onPlayAgain && (
              <button
                onClick={() => {
                  audio.playActionSound();
                  haptics.mediumTap();
                  onPlayAgain();
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl gold-button text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-98"
              >
                <RotateCcw size={16} />
                <span>Play Again</span>
              </button>
            )}

            <button
              onClick={scrollToTop}
              className="p-3.5 rounded-xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-stone-200 text-slate-400 hover:text-amber-400 transition-colors"
              title="Scroll to Top"
              aria-label="Scroll back to top of review"
            >
              <ArrowUp size={18} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
