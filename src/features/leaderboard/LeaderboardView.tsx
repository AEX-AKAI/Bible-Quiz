import React from 'react';
import { LeaderboardEntry } from '../../data/api/OnlineChallengeService';
import { Trophy, ArrowLeft, Smartphone, Monitor, Globe, Award, Flame, Target } from 'lucide-react';

interface Props {
  entries: LeaderboardEntry[];
  challengeId: string;
  onBack: () => void;
}

export const LeaderboardView: React.FC<Props> = ({ entries, challengeId, onBack }) => {
  const getPlatformIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('android') || p.includes('ios')) {
      return <Smartphone size={13} className="text-sky-400" />;
    }
    if (p.includes('windows') || p.includes('mac') || p.includes('linux')) {
      return <Monitor size={13} className="text-purple-400" />;
    }
    return <Globe size={13} className="text-emerald-400" />;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <span className="text-sm">🥇</span>;
    if (rank === 2) return <span className="text-sm">🥈</span>;
    if (rank === 3) return <span className="text-sm">🥉</span>;
    return <span className="text-xs font-mono font-bold text-slate-400">#{rank}</span>;
  };

  return (
    <div className="flex-1 flex flex-col celestial-bg parchment-pattern text-slate-100 overflow-y-auto">
      <div className="max-w-2xl w-full mx-auto p-4 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-500/15">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-850 transition-colors"
            title="Back to Results"
            aria-label="Back to Results"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="text-center">
            <h1 className="font-display text-lg sm:text-xl font-bold text-white tracking-wide">
              Cross-Platform Standings
            </h1>
            <p className="text-[11px] font-mono text-amber-400/90">
              Challenge Seed #{challengeId}
            </p>
          </div>

          <div className="w-8" />
        </div>

        {/* Global Sync Banner */}
        <div className="sacred-card p-3 rounded-xl flex items-center gap-2.5 text-xs text-amber-200/90 border border-amber-500/25">
          <Award size={18} className="text-amber-400 flex-shrink-0" />
          <span>Verified cross-play rankings synchronized deterministically across Web, Mobile & Desktop.</span>
        </div>

        {/* Leaderboard Cards */}
        <div className="space-y-2.5 flex-1 mt-1">
          {entries.map((entry) => {
            const isUser = entry.isUser;
            const isFirst = entry.rank === 1;

            return (
              <div
                key={entry.playerName + entry.rank}
                className={`p-3 sm:p-4 rounded-xl border transition-all flex items-center justify-between ${
                  isUser
                    ? 'sacred-card border-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/40'
                    : isFirst
                    ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border-amber-500/40'
                    : 'bg-slate-900/80 border-slate-800/80'
                }`}
              >
                {/* Left: Rank & Player Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black ${
                    entry.rank === 1
                      ? 'bg-gradient-to-br from-amber-400 to-yellow-600 text-slate-950 shadow-md shadow-amber-500/20'
                      : entry.rank === 2
                      ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-slate-950'
                      : entry.rank === 3
                      ? 'bg-gradient-to-br from-amber-700 to-amber-900 text-amber-100'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {getRankBadge(entry.rank)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm truncate ${isUser ? 'text-amber-300' : 'text-slate-100'}`}>
                        {entry.playerName}
                      </span>
                      {isUser && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold uppercase tracking-wider">
                          YOU
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        {getPlatformIcon(entry.platform)}
                        <span className="capitalize">{entry.platform}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-emerald-400">
                        <Target size={11} />
                        <span>{entry.accuracy}%</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-amber-400">
                        <Flame size={11} />
                        <span>{entry.bestCombo}x</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Score */}
                <div className="text-right pl-3">
                  <div className="font-mono text-base sm:text-lg font-black text-amber-400">
                    {entry.score.toFixed(1)}
                  </div>
                  <div className="text-[9px] text-slate-500 font-bold tracking-widest uppercase">
                    POINTS
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Back Button */}
        <button
          onClick={onBack}
          className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-750 text-slate-200 hover:text-white font-bold text-xs uppercase tracking-wider transition-all active:scale-[0.99]"
        >
          Back to Results
        </button>
      </div>
    </div>
  );
};
