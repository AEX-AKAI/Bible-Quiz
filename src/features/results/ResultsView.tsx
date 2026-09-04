import React, { useEffect, useState } from 'react';
import { ChallengeResult } from '../../data/models/ChallengeModels';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  Flame, 
  Zap, 
  Target, 
  Clock, 
  ArrowRight, 
  RotateCcw, 
  ListFilter, 
  CheckCircle, 
  XCircle, 
  BookOpen, 
  Award, 
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Props {
  result: ChallengeResult;
  onPlayAgain: () => void;
  onViewLeaderboard: () => void;
  onHome: () => void;
}

export const ResultsView: React.FC<Props> = ({
  result,
  onPlayAgain,
  onViewLeaderboard,
  onHome,
}) => {
  const [showReview, setShowReview] = useState(false);

  // Determine encouragement theme
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
    ? 'A strong round! Keep growing in the Word.'
    : 'Every question builds deeper wisdom. Keep pressing forward!';

  useEffect(() => {
    if (isVictory) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#FCD34D', '#E0E7FF', '#10B981'],
        });
      } catch {}
    }
  }, [isVictory]);

  return (
    <div className="flex-1 flex flex-col celestial-bg parchment-pattern text-slate-100 overflow-y-auto">
      <div className="max-w-2xl w-full mx-auto p-4 sm:p-6 flex-1 flex flex-col justify-between space-y-5">
        
        {/* Header Banner */}
        <div className="text-center pt-2 pb-1">
          <div className={`w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center shadow-xl ring-1 ${
            isVictory
              ? 'bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 shadow-amber-500/25 ring-amber-300/50'
              : isModerate
              ? 'bg-gradient-to-tr from-slate-700 via-slate-600 to-indigo-500 text-white shadow-indigo-500/20 ring-indigo-400/30'
              : 'bg-gradient-to-tr from-amber-900/60 to-slate-800 text-amber-300 shadow-slate-900 ring-amber-500/20'
          }`}>
            {isVictory ? <Trophy size={32} /> : isModerate ? <Award size={32} /> : <BookOpen size={30} />}
          </div>

          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400/90 font-mono">
            Challenge #{result.challengeId} • {result.durationSeconds}s
          </span>

          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-1">
            {headerTitle}
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto mt-1.5 leading-relaxed">
            {headerSubtitle}
          </p>
        </div>

        {/* Primary Final Score Display */}
        <div className="sacred-card rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />
          
          <div className="text-center pb-5 border-b border-amber-500/15">
            <span className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">
              Final Verified Score
            </span>
            <div className="font-mono text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-200 mt-1">
              {result.finalScore.toFixed(1)}
            </div>
            <div className="text-[10px] text-amber-400/80 font-medium tracking-wide mt-0.5">
              Verified Against Anti-Cheat Engine
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4">
            {/* Accuracy */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
              <Target size={18} className="mx-auto mb-1 text-emerald-400" />
              <div className="font-mono text-lg sm:text-xl font-bold text-white">
                {result.accuracyPercentage}%
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Accuracy</div>
            </div>

            {/* Best Combo */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
              <Flame size={18} className="mx-auto mb-1 text-amber-500" />
              <div className="font-mono text-lg sm:text-xl font-bold text-amber-300">
                {result.bestCombo}x
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Best Streak</div>
            </div>

            {/* Speed Bonuses */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
              <Zap size={18} className="mx-auto mb-1 text-yellow-400" />
              <div className="font-mono text-lg sm:text-xl font-bold text-yellow-300">
                {result.fastAnswersCount}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Speed Bonuses</div>
            </div>

            {/* Average Reflex */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
              <Clock size={18} className="mx-auto mb-1 text-sky-400" />
              <div className="font-mono text-lg sm:text-xl font-bold text-sky-300">
                {result.averageResponseTimeSeconds}s
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Avg Reflex</div>
            </div>
          </div>
        </div>

        {/* Review Answers Accordion */}
        <div className="sacred-card rounded-2xl overflow-hidden border border-slate-800">
          <button
            onClick={() => setShowReview(!showReview)}
            className="w-full flex items-center justify-between p-4 bg-slate-900/70 hover:bg-slate-850 text-left transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <ListFilter size={18} className="text-amber-400" />
              <span className="font-bold text-sm text-slate-200">
                Review Scripture Questions ({result.answerReviews.length})
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>{showReview ? 'Hide' : 'Inspect'}</span>
              {showReview ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </button>

          {showReview && (
            <div className="p-4 space-y-3 max-h-80 overflow-y-auto border-t border-slate-800/80">
              {result.answerReviews.map((rev, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                    rev.isCorrect
                      ? 'bg-emerald-950/30 border-emerald-500/30 text-slate-200'
                      : 'bg-rose-950/30 border-rose-500/30 text-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="font-bold text-sm text-white">
                      #{rev.questionNumber}. {rev.questionText}
                    </span>
                    {rev.isCorrect ? (
                      <CheckCircle size={17} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle size={17} className="text-rose-400 flex-shrink-0 mt-0.5" />
                    )}
                  </div>

                  <div className="space-y-0.5 mt-2">
                    <div className="text-slate-400">
                      Your answer:{' '}
                      <span className={rev.isCorrect ? 'text-emerald-300 font-bold' : 'text-rose-300 font-bold'}>
                        {rev.selectedAnswer}
                      </span>
                    </div>
                    {!rev.isCorrect && (
                      <div className="text-emerald-400 font-semibold">
                        Correct answer: {rev.correctAnswer}
                      </div>
                    )}
                  </div>

                  <div className="text-amber-200/90 mt-2 italic text-[11px] bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                    📖 <span className="font-bold text-amber-300">{rev.scriptureReference}</span>: {rev.explanation}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          {/* Primary Action: Play Again */}
          <button
            onClick={onPlayAgain}
            className="w-full gold-button py-4 px-6 rounded-xl flex items-center justify-center gap-2.5 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl transition-all"
          >
            <RotateCcw size={18} />
            <span>Play Next Challenge</span>
          </button>

          {/* Secondary Actions: Leaderboard & Home */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={onViewLeaderboard}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-750 text-slate-200 hover:text-white font-bold text-xs uppercase tracking-wider transition-all active:scale-95"
            >
              <Trophy size={16} className="text-amber-400" />
              <span>Leaderboard</span>
            </button>
            <button
              onClick={onHome}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-750 text-slate-200 hover:text-white font-bold text-xs uppercase tracking-wider transition-all active:scale-95"
            >
              <ArrowRight size={16} />
              <span>Main Menu</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
