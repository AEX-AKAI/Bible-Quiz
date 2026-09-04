import React from 'react';
import { LeaderboardEntry } from '../../data/api/OnlineChallengeService';
import { Trophy, ArrowLeft, Smartphone, Monitor, Globe, Award } from 'lucide-react';

interface Props {
  entries: LeaderboardEntry[];
  challengeId: string;
  onBack: () => void;
}

export const LeaderboardView: React.FC<Props> = ({ entries, challengeId, onBack }) => {
  const getPlatformIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('android') || p.includes('ios')) {
      return <Smartphone size={14} className="text-sky-400" />;
    }
    if (p.includes('windows') || p.includes('mac') || p.includes('linux')) {
      return <Monitor size={14} className="text-purple-400" />;
    }
    return <Globe size={14} className="text-emerald-400" />;
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 overflow-y-auto">
      <div className="max-w-xl w-full mx-auto p-4 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="text-center">
            <h1 className="text-lg font-bold text-white">Cross-Platform Standings</h1>
            <p className="text-[11px] text-slate-400">Challenge #{challengeId}</p>
          </div>
          <div className="w-8" />
        </div>

        <div className="my-3 p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-300 flex items-center gap-2">
          <Award size={18} className="text-amber-400 flex-shrink-0" />
          <span>Real-time cross-play rankings synchronized across Android, iOS, Web & Desktop.</span>
        </div>

        {/* Leaderboard Table */}
        <div className="space-y-2 mt-2 flex-1">
          {entries.map((entry) => {
            const isTop3 = entry.rank <= 3;
            return (
              <div
                key={entry.playerName + entry.rank}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  entry.isUser
                    ? 'bg-amber-950/40 border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                    : 'bg-slate-900/90 border-slate-800/80'
                }`}
              >
                {/* Rank & Player Info */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                      entry.rank === 1
                        ? 'bg-amber-500 text-slate-950'
                        : entry.rank === 2
                        ? 'bg-slate-300 text-slate-950'
                        : entry.rank === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {entry.rank}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 font-semibold text-sm text-slate-100">
                      <span>{entry.playerName}</span>
                      {entry.isUser && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-bold">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        {getPlatformIcon(entry.platform)}
                        <span>{entry.platform}</span>
                      </span>
                      <span>•</span>
                      <span>{entry.accuracy}% acc</span>
                      <span>•</span>
                      <span>{entry.bestCombo}x combo</span>
                    </div>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className="font-mono text-base font-extrabold text-amber-400">
                    {entry.score.toFixed(1)}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    POINTS
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onBack}
          className="w-full mt-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-colors"
        >
          Back to Results
        </button>
      </div>
    </div>
  );
};
