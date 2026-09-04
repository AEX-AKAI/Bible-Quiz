import React, { useState, useEffect } from 'react';
import { ChallengeConfig } from '../../data/models/ChallengeModels';
import { ChallengeDuration, NetworkStatus } from '../../core/types';
import { UserProfile, AppSettings } from '../../data/models/UserProfile';
import { NetworkStatusBadge } from '../../components/NetworkStatusBadge';
import { Play, Flame, Clock, Sliders, User, Globe, Shield, Sparkles, Hash } from 'lucide-react';

interface Props {
  userProfile: UserProfile;
  settings: AppSettings;
  networkStatus: NetworkStatus;
  onStartChallenge: (config: ChallengeConfig) => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
}

const DURATIONS: { label: string; seconds: ChallengeDuration; subtitle: string }[] = [
  { label: '30s', seconds: 30, subtitle: 'Rapid Fire' },
  { label: '1m', seconds: 60, subtitle: 'Quick Quiz' },
  { label: '3m', seconds: 180, subtitle: 'Bible Battle' },
  { label: '5m', seconds: 300, subtitle: 'Scripture Duel' },
  { label: '10m', seconds: 600, subtitle: 'Marathon' },
];

export const LobbyView: React.FC<Props> = ({
  userProfile,
  settings,
  networkStatus,
  onStartChallenge,
  onOpenSettings,
  onOpenProfile,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<ChallengeDuration>(180);
  const [challengeCode, setChallengeCode] = useState('ABC123');
  const [isOnlineMode, setIsOnlineMode] = useState(true);

  const handleLaunch = () => {
    const cleanCode = challengeCode.trim().toUpperCase() || 'ABC123';
    const config: ChallengeConfig = {
      challengeId: cleanCode,
      seed: cleanCode,
      timeLimitSeconds: selectedDuration,
      difficulty: 'MIXED',
      isOnline: isOnlineMode && networkStatus === 'ONLINE',
      totalQuestions: 35,
    };
    onStartChallenge(config);
  };

  // Keyboard shortcut Space / Enter to launch
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleLaunch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedDuration, challengeCode, isOnlineMode, networkStatus]);

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 overflow-y-auto">
      {/* Top App Header */}
      <header className="w-full max-w-xl mx-auto px-4 py-3 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center font-black text-slate-950 text-base shadow-md shadow-amber-500/20">
            ✝
          </div>
          <div>
            <div className="font-extrabold text-sm text-white tracking-tight">Bible Quiz</div>
            <div className="text-[10px] text-slate-400">Cross-Platform v2.0</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <NetworkStatusBadge status={networkStatus} />
          <button
            onClick={onOpenProfile}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850 transition-colors"
            title="Profile"
            aria-label="Profile"
          >
            <User size={16} />
          </button>
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850 transition-colors"
            title="Settings"
            aria-label="Settings"
          >
            <Sliders size={16} />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-xl w-full mx-auto p-4 flex-1 flex flex-col justify-between">
        {/* Welcome & Stats Hero */}
        <div className="py-2">
          <div className="p-4 rounded-2xl bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-900/90 border border-indigo-500/20 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[11px] text-indigo-300 font-semibold uppercase tracking-wider">Welcome Back</span>
                <h1 className="text-lg font-bold text-white">{userProfile.displayName}</h1>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Highest Score</span>
                <span className="font-mono text-base font-black text-amber-400">
                  {userProfile.highestScore.toFixed(1)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-800/50">
                <div className="font-bold text-slate-200">{userProfile.totalChallengesPlayed}</div>
                <div className="text-[10px] text-slate-400">Challenges</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/50">
                <div className="font-bold text-amber-400">{userProfile.bestComboRecord}x</div>
                <div className="text-[10px] text-slate-400">Best Streak</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/50">
                <div className="font-bold text-emerald-400">{userProfile.totalCorrectAnswers}</div>
                <div className="text-[10px] text-slate-400">Correct Answers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Challenge Duration Selector */}
        <div className="py-2">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Clock size={14} className="text-amber-400" />
              <span>Select Challenge Duration</span>
            </label>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {DURATIONS.map((d) => {
              const isSelected = selectedDuration === d.seconds;
              return (
                <button
                  key={d.seconds}
                  onClick={() => setSelectedDuration(d.seconds)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                  }`}
                >
                  <div className="font-black text-sm">{d.label}</div>
                  <div className="text-[9px] truncate opacity-80 mt-0.5">{d.subtitle}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cross-Platform Match Code & Mode */}
        <div className="py-2 space-y-3">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-1.5">
              <Hash size={14} className="text-indigo-400" />
              <span>Challenge Room Code (Cross-Play Seed)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={challengeCode}
                maxLength={8}
                onChange={(e) => setChallengeCode(e.target.value.toUpperCase())}
                placeholder="ABC123"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm font-mono font-bold tracking-widest text-amber-300 focus:outline-none focus:border-amber-400 uppercase"
              />
              <span className="absolute right-3 top-2.5 text-[10px] text-slate-500">
                Synchronizes players across Android, iOS & Web
              </span>
            </div>
          </div>

          {/* Mode toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <Globe size={18} className={isOnlineMode ? 'text-emerald-400' : 'text-slate-500'} />
              <div>
                <div className="text-xs font-semibold text-slate-200">
                  {isOnlineMode ? 'Online Competitive Mode' : 'Offline Solo Practice'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {isOnlineMode ? 'Global leaderboards & verified scoring' : 'Pure local play without network'}
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isOnlineMode}
              onChange={(e) => setIsOnlineMode(e.target.checked)}
              className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Launch Button */}
        <div className="pt-3 pb-1">
          <button
            onClick={handleLaunch}
            className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-base shadow-xl shadow-amber-500/25 active:scale-[0.99] transition-transform"
          >
            <Play size={22} fill="currentColor" />
            <span>START CHALLENGE</span>
          </button>
          <p className="text-center text-[10px] text-slate-500 mt-2">
            Tip: Press <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Space</kbd> or <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Enter</kbd> to start
          </p>
        </div>
      </main>
    </div>
  );
};
