import React, { useState } from 'react';
import { LeaderboardEntry } from '../../data/api/OnlineChallengeService';
import { AppNavbar } from '../../components/AppNavbar';
import { WebAudioEngine } from '../../platform/audio/WebAudioEngine';
import { HapticService } from '../../platform/haptics/HapticService';
import { 
  Trophy, 
  Smartphone, 
  Monitor, 
  Globe, 
  Award, 
  Flame, 
  Target, 
  Crown, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface Props {
  entries: LeaderboardEntry[];
  challengeId: string;
  onBack: () => void;
  onNavigate?: (tab: 'HOME' | 'CHALLENGES' | 'LEADERBOARD' | 'SETTINGS') => void;
  onOpenProfile?: () => void;
}

type TimeframeTab = 'GLOBAL' | 'FRIENDS' | 'THIS_WEEK' | 'THIS_MONTH';

export const LeaderboardView: React.FC<Props> = ({ 
  entries, 
  challengeId, 
  onBack,
  onNavigate,
  onOpenProfile,
}) => {
  const [activeTab, setActiveTab] = useState<TimeframeTab>('GLOBAL');

  const audio = WebAudioEngine.getInstance();
  const haptics = HapticService.getInstance();

  const handleTabChange = (tab: TimeframeTab) => {
    audio.playTabSound();
    haptics.lightTap();
    setActiveTab(tab);
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
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="w-full min-h-[100vh] min-h-[100dvh] flex-1 flex flex-col celestial-bg parchment-pattern dark:text-slate-100 text-stone-900 overflow-x-hidden selection:bg-amber-500/30 pb-12">
      
      {/* 1. TOP NAVBAR */}
      <AppNavbar
        activeTab="LEADERBOARD"
        onNavigate={(tab) => {
          if (tab === 'LEADERBOARD') return;
          if (onNavigate) onNavigate(tab);
          else onBack();
        }}
        onOpenProfile={onOpenProfile}
      />

      {/* 2. MAIN LEADERBOARD CONTAINER (Screen 5 & 11) */}
      <main className="w-full max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 flex flex-col">
        
        {/* Subheader Title & Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-amber-500/15 mb-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-amber-500 dark:text-amber-400 mb-1">
              Global Cross-Play Standings
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              Leaderboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Top performers who are shining for Christ through knowledge.
            </p>
          </div>

          {/* Timeframe Filter Tabs (Global | Friends | This Week | This Month) */}
          <div className="flex items-center gap-1.5 sacred-card p-1.5 rounded-xl border border-amber-500/20">
            {[
              { id: 'GLOBAL', label: 'Global' },
              { id: 'FRIENDS', label: 'Friends' },
              { id: 'THIS_WEEK', label: 'This Week' },
              { id: 'THIS_MONTH', label: 'This Month' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as TimeframeTab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2-COLUMN GRID (Desktop: Standings Table + Inspiration Card) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
          
          {/* LEFT / MAIN COLUMN: Standings Table */}
          <div className="lg:col-span-8 space-y-3">
            
            {/* Table Header (Desktop) */}
            <div className="hidden sm:grid sm:grid-cols-12 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <div className="col-span-2"># Rank</div>
              <div className="col-span-5">Player</div>
              <div className="col-span-2 text-right">Score</div>
              <div className="col-span-3 text-right">Accuracy</div>
            </div>

            {/* Standings Rows */}
            {entries.map((entry) => {
              const isUser = entry.isUser;
              const isTop3 = entry.rank <= 3;

              return (
                <div
                  key={entry.playerName + entry.rank}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex sm:grid sm:grid-cols-12 items-center justify-between gap-3 ${
                    isUser
                      ? 'sacred-card border-amber-400 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.2)] ring-1 ring-amber-400/50'
                      : isTop3
                      ? 'sacred-card border-amber-500/30 bg-slate-900/80 shadow-md'
                      : 'sacred-card border-slate-800/80 hover:border-slate-700 bg-slate-900/60'
                  }`}
                >
                  {/* Rank Column */}
                  <div className="sm:col-span-2 flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-black text-sm ${
                      entry.rank === 1
                        ? 'bg-gradient-to-br from-amber-400 to-yellow-600 text-slate-950 shadow-md shadow-amber-500/30'
                        : entry.rank === 2
                        ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-slate-950'
                        : entry.rank === 3
                        ? 'bg-gradient-to-br from-amber-700 to-amber-900 text-amber-100'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {getRankBadge(entry.rank)}
                    </div>
                  </div>

                  {/* Player Column */}
                  <div className="sm:col-span-5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm truncate ${
                        isUser ? 'text-amber-300' : 'text-white'
                      }`}>
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
                    </div>
                  </div>

                  {/* Score Column */}
                  <div className="sm:col-span-2 text-right">
                    <span className="font-mono text-base sm:text-lg font-black text-amber-300">
                      {entry.score.toFixed(1)}
                    </span>
                  </div>

                  {/* Accuracy Column */}
                  <div className="sm:col-span-3 text-right hidden sm:block">
                    <span className="text-xs font-semibold text-slate-300">
                      {entry.accuracy}%
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Mobile View Full Leaderboard Button */}
            <div className="sm:hidden pt-2">
              <button
                onClick={onBack}
                className="w-full py-3 rounded-xl bg-slate-900 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center justify-center gap-2"
              >
                <span>Back to Home</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Scripture Inspiration Card (Desktop Screen 5 & Mobile Screen 11) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Crown Inspiration Card */}
            <div className="sacred-card p-6 rounded-2xl border border-amber-500/25 text-center relative overflow-hidden space-y-4">
              {/* Crown Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-600 text-slate-950 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/25">
                <Crown size={32} />
              </div>

              {/* Scripture Verse */}
              <p className="font-serif italic text-sm text-amber-200/90 leading-relaxed">
                "Let your light shine before others, that they may see your good deeds and glorify your Father in heaven."
              </p>
              <div className="text-xs font-bold text-amber-400">
                &mdash; Matthew 5:16
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-1">
                <div className="font-bold text-xs text-white uppercase tracking-wider">
                  Keep Going!
                </div>
                <div className="text-xs text-slate-400">
                  Every question is a step closer to knowing Him more.
                </div>
              </div>
            </div>

            {/* Foundation Seal */}
            <div className="text-center py-2">
              <div className="text-[9px] tracking-[0.2em] font-extrabold uppercase text-slate-500">
                TESTIFY FOUNDATION &bull; FAITH &bull; KNOWLEDGE
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
};
