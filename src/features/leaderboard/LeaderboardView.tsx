import React from 'react';
import { LeaderboardEntry } from '../../data/api/OnlineChallengeService';
import { Trophy, ArrowLeft, Smartphone, Monitor, Globe, Award, Flame, Target } from 'lucide-react';
import { WebAudioEngine } from '../../platform/audio/WebAudioEngine';
import { HapticService } from '../../platform/haptics/HapticService';

interface Props {
  entries: LeaderboardEntry[];
  challengeId: string;
  onBack: () => void;
}

export const LeaderboardView: React.FC<Props> = ({ entries, challengeId, onBack }) => {
  const audio = WebAudioEngine.getInstance();
  const haptics = HapticService.getInstance();

  const handleBack = () => {
    audio.playButtonTap();
    haptics.lightTap();
    onBack();
  };
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
    <div className="flex-1 flex flex-col celestial-bg parchment-pattern dark:text-slate-100 text-stone-900 overflow-y-auto">
      <div className="max-w-2xl w-full mx-auto p-4 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-500/15">
          <button
            onClick={handleBack}
            className="p-2 -ml-2 rounded-xl dark:text-slate-400 text-stone-500 hover:text-amber-500 dark:hover:text-white dark:hover:bg-slate-900 hover:bg-stone-100 border border-transparent transition-colors"
            title="Back"
            aria-label="Back"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="text-center">
            <h1 className="font-display text-lg sm:text-xl font-bold dark:text-white text-stone-900 tracking-wide">
              Cross-Platform Standings
            </h1>
            <p className="text-[11px] font-mono text-amber-500 dark:text-amber-400/90">
              Challenge Seed #{challengeId}
            </p>
          </div>

          <div className="w-8" />
        </div>

        {/* Global Sync Banner */}
        <div className="sacred-card p-3 rounded-xl flex items-center gap-2.5 text-xs dark:text-amber-200/90 text-amber-900 border border-amber-500/25 shadow-sm">
          <Award size={18} className="text-amber-500 dark:text-amber-400 flex-shrink-0" />
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
                    ? 'sacred-card border-amber-500 dark:border-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/50'
                    : isFirst
                    ? 'dark:bg-gradient-to-r dark:from-amber-950/40 dark:via-slate-900 dark:to-slate-900 bg-amber-50/80 border-amber-500/40 shadow-sm'
                    : 'dark:bg-slate-900/80 bg-white/90 dark:border-slate-800/80 border-stone-200 shadow-sm'
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
                      : 'dark:bg-slate-800 bg-stone-100 dark:text-slate-400 text-stone-600 border border-stone-200 dark:border-transparent'
                  }`}>
                    {getRankBadge(entry.rank)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm truncate ${isUser ? 'dark:text-amber-300 text-amber-700' : 'dark:text-slate-100 text-stone-900'}`}>
                        {entry.playerName}
                      </span>
                      {isUser && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 dark:text-amber-300 text-amber-800 border border-amber-500/40 font-bold uppercase tracking-wider">
                          YOU
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] dark:text-slate-400 text-stone-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        {getPlatformIcon(entry.platform)}
                        <span className="capitalize">{entry.platform}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-emerald-500 dark:text-emerald-400 font-medium">
                        <Target size={11} />
                        <span>{entry.accuracy}%</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-amber-500 dark:text-amber-400 font-medium">
                        <Flame size={11} />
                        <span>{entry.bestCombo}x</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Score */}
                <div className="text-right pl-3">
                  <div className="font-mono text-base sm:text-lg font-black text-amber-600 dark:text-amber-400">
                    {entry.score.toFixed(1)}
                  </div>
                  <div className="text-[9px] dark:text-slate-500 text-stone-400 font-bold tracking-widest uppercase">
                    POINTS
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Back Button */}
        <button
          onClick={handleBack}
          className="w-full py-3.5 rounded-xl dark:bg-slate-900 bg-white hover:dark:bg-slate-850 hover:bg-stone-50 border dark:border-slate-800 border-stone-200 dark:text-slate-200 text-stone-800 font-bold text-xs uppercase tracking-wider transition-all active:scale-[0.99] shadow-sm"
        >
          Back
        </button>
      </div>
    </div>
  );
};
