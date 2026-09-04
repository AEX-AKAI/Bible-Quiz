import React, { useEffect, useState } from 'react';
import { ChallengeResult } from '../../data/models/ChallengeModels';
import confetti from 'canvas-confetti';
import { Trophy, Flame, Zap, Target, Clock, ArrowRight, RotateCcw, ListFilter, CheckCircle, XCircle } from 'lucide-react';

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

  useEffect(() => {
    if (result.accuracyPercentage >= 70) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#FCD34D', '#6366F1', '#10B981'],
        });
      } catch {}
    }
  }, [result.accuracyPercentage]);

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 overflow-y-auto">
      <div className="max-w-xl w-full mx-auto p-4 flex-1 flex flex-col justify-between">
        {/* Header Banner */}
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Trophy size={32} className="text-slate-950" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Challenge Complete!
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Challenge #{result.challengeId} • {result.durationSeconds}s Mode
          </p>
        </div>

        {/* Primary Score Card */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-900/80 border border-slate-800 rounded-2xl p-5 mb-4 shadow-xl">
          <div className="text-center pb-4 border-b border-slate-800">
            <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Total Verified Score</span>
            <div className="text-4xl md:text-5xl font-black text-amber-400 mt-1">
              {result.finalScore.toFixed(1)}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <div className="p-2.5 rounded-xl bg-slate-800/60 text-center">
              <Target size={18} className="mx-auto mb-1 text-emerald-400" />
              <div className="text-lg font-bold">{result.accuracyPercentage}%</div>
              <div className="text-[10px] text-slate-400">Accuracy</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-800/60 text-center">
              <Flame size={18} className="mx-auto mb-1 text-amber-500" />
              <div className="text-lg font-bold">{result.bestCombo}x</div>
              <div className="text-[10px] text-slate-400">Best Streak</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-800/60 text-center">
              <Zap size={18} className="mx-auto mb-1 text-yellow-400" />
              <div className="text-lg font-bold">{result.fastAnswersCount}</div>
              <div className="text-[10px] text-slate-400">Speed Bonuses</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-800/60 text-center">
              <Clock size={18} className="mx-auto mb-1 text-sky-400" />
              <div className="text-lg font-bold">{result.averageResponseTimeSeconds}s</div>
              <div className="text-[10px] text-slate-400">Avg Response</div>
            </div>
          </div>
        </div>

        {/* Review Answers Toggle */}
        <div className="mb-4">
          <button
            onClick={() => setShowReview(!showReview)}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-sm font-semibold text-slate-200 hover:bg-slate-850 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ListFilter size={18} className="text-indigo-400" />
              <span>Review Scripture Answers ({result.answerReviews.length})</span>
            </div>
            <span className="text-xs text-slate-400">{showReview ? 'Hide' : 'View'}</span>
          </button>

          {showReview && (
            <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {result.answerReviews.map((rev, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs ${
                    rev.isCorrect
                      ? 'bg-emerald-950/30 border-emerald-500/30'
                      : 'bg-rose-950/30 border-rose-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-bold text-slate-200">
                      #{rev.questionNumber}. {rev.questionText}
                    </span>
                    {rev.isCorrect ? (
                      <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
                    ) : (
                      <XCircle size={16} className="text-rose-400 flex-shrink-0" />
                    )}
                  </div>

                  <div className="text-slate-400 mt-1">
                    Your Answer: <span className={rev.isCorrect ? 'text-emerald-300 font-semibold' : 'text-rose-300 font-semibold'}>{rev.selectedAnswer}</span>
                    {!rev.isCorrect && (
                      <span className="block text-emerald-400 mt-0.5">
                        Correct: {rev.correctAnswer}
                      </span>
                    )}
                  </div>

                  <div className="text-slate-400 mt-1 italic text-[11px]">
                    📖 {rev.scriptureReference} — {rev.explanation}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 mt-auto pt-2">
          <button
            onClick={onPlayAgain}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 active:scale-[0.99] transition-transform"
          >
            <RotateCcw size={18} />
            <span>Play Next Challenge</span>
          </button>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={onViewLeaderboard}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs transition-colors"
            >
              <Trophy size={16} className="text-amber-400" />
              <span>Leaderboard</span>
            </button>
            <button
              onClick={onHome}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs transition-colors"
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
