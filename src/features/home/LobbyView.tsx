import React, { useState, useEffect } from 'react';
import { ChallengeConfig } from '../../data/models/ChallengeModels';
import { ChallengeDuration, NetworkStatus } from '../../core/types';
import { UserProfile, AppSettings } from '../../data/models/UserProfile';
import { NetworkStatusBadge } from '../../components/NetworkStatusBadge';
import { 
  Play, 
  Flame, 
  Clock, 
  Sliders, 
  User, 
  Globe, 
  Shield, 
  Sparkles, 
  Hash, 
  Zap, 
  Award, 
  BookOpen, 
  Users, 
  Plus, 
  LogIn, 
  X, 
  Check, 
  Shuffle,
  LucideIcon
} from 'lucide-react';

interface Props {
  userProfile: UserProfile;
  settings: AppSettings;
  networkStatus: NetworkStatus;
  onStartChallenge: (config: ChallengeConfig) => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
}

interface ModeCard {
  seconds: ChallengeDuration;
  label: string;
  name: string;
  tagline: string;
  difficulty: string;
  icon: LucideIcon;
  accentColor: string;
}

const CHALLENGE_MODES: ModeCard[] = [
  { 
    seconds: 30, 
    label: '30s', 
    name: 'Rapid Fire', 
    tagline: 'Fast answers. Faster thinking.', 
    difficulty: 'Quick Reflex', 
    icon: Zap,
    accentColor: 'from-amber-400 to-yellow-500'
  },
  { 
    seconds: 60, 
    label: '1m', 
    name: 'Quick Quiz', 
    tagline: 'Classic scripture sprint.', 
    difficulty: 'Balanced', 
    icon: Clock,
    accentColor: 'from-amber-500 to-amber-600'
  },
  { 
    seconds: 180, 
    label: '3m', 
    name: 'Bible Battle', 
    tagline: 'Balanced competitive challenge.', 
    difficulty: 'Official Ranked', 
    icon: Flame,
    accentColor: 'from-amber-500 to-orange-600'
  },
  { 
    seconds: 300, 
    label: '5m', 
    name: 'Scripture Duel', 
    tagline: 'Deep knowledge endurance.', 
    difficulty: 'Progressive', 
    icon: Shield,
    accentColor: 'from-indigo-400 to-amber-500'
  },
  { 
    seconds: 600, 
    label: '10m', 
    name: 'Bible Marathon', 
    tagline: 'The ultimate mastery test.', 
    difficulty: 'High Stamina', 
    icon: BookOpen,
    accentColor: 'from-amber-300 via-yellow-400 to-amber-600'
  },
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

  // Modal dialog states for Create & Join Challenge
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [customJoinInput, setCustomJoinInput] = useState('');

  const generateRandomSeed = () => {
    const prefixes = ['GRACE', 'FAITH', 'HOPE', 'GLORY', 'PSALM', 'PEACE', 'LIGHT', 'TRUTH'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNum = Math.floor(10 + Math.random() * 90);
    return `${randomPrefix}${randomNum}`;
  };

  const handleLaunchWithCode = (seed: string, duration: ChallengeDuration = selectedDuration) => {
    const cleanCode = seed.trim().toUpperCase() || 'ABC123';
    setChallengeCode(cleanCode);
    const config: ChallengeConfig = {
      challengeId: cleanCode,
      seed: cleanCode,
      timeLimitSeconds: duration,
      difficulty: 'MIXED',
      isOnline: isOnlineMode && networkStatus === 'ONLINE',
      totalQuestions: 35,
    };
    onStartChallenge(config);
  };

  const handlePlayNow = () => {
    handleLaunchWithCode(challengeCode, selectedDuration);
  };

  const handleCreateRoomConfirm = () => {
    setIsCreateModalOpen(false);
    handleLaunchWithCode(challengeCode, selectedDuration);
  };

  const handleJoinConfirm = () => {
    const targetCode = customJoinInput.trim().toUpperCase();
    if (targetCode) {
      setChallengeCode(targetCode);
      setIsJoinModalOpen(false);
      handleLaunchWithCode(targetCode, selectedDuration);
    }
  };

  // Keyboard shortcut: Space / Enter starts challenge when not in input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (isCreateModalOpen || isJoinModalOpen) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handlePlayNow();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedDuration, challengeCode, isOnlineMode, networkStatus, isCreateModalOpen, isJoinModalOpen]);

  const activeMode = CHALLENGE_MODES.find((m) => m.seconds === selectedDuration) || CHALLENGE_MODES[2];

  return (
    <div className="flex-1 flex flex-col celestial-bg parchment-pattern text-slate-100 overflow-y-auto selection:bg-amber-500/30">
      {/* 1. TOP APP BAR */}
      <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-slate-950/70 border-b border-amber-500/10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 ring-1 ring-amber-300/40">
              <BookOpen size={18} className="text-slate-950" />
            </div>
            <div>
              <div className="font-display font-bold text-sm tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-400">
                BIBLE QUIZ
              </div>
              <div className="text-[10px] text-slate-400 font-medium tracking-tight">Scripture Challenge Engine</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <NetworkStatusBadge status={networkStatus} />
            <button
              onClick={onOpenProfile}
              className="p-2 rounded-xl bg-slate-900/80 border border-slate-750 text-slate-300 hover:text-amber-300 hover:border-amber-500/40 transition-all active:scale-95"
              title="Player Profile"
              aria-label="Player Profile"
            >
              <User size={16} />
            </button>
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl bg-slate-900/80 border border-slate-750 text-slate-300 hover:text-amber-300 hover:border-amber-500/40 transition-all active:scale-95"
              title="Settings & Audio"
              aria-label="Settings and Audio"
            >
              <Sliders size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <main className="max-w-2xl w-full mx-auto px-4 py-5 flex-1 flex flex-col justify-between space-y-6">
        
        {/* HERO SECTION */}
        <section className="relative text-center pt-2 pb-3">
          {/* Subtle Ambient Ray/Glow Behind Hero */}
          <div className="absolute inset-0 -top-6 flex items-center justify-center pointer-events-none opacity-40">
            <div className="w-80 h-32 bg-amber-500/15 blur-3xl rounded-full" />
          </div>

          <div className="relative z-10">
            {/* Elegant Scripture Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-medium mb-3">
              <Sparkles size={13} className="text-amber-400" />
              <span>Thy Word is a lamp unto my feet</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2 leading-tight">
              BIBLE QUIZ
            </h1>
            
            <p className="text-sm sm:text-base text-amber-100/80 font-medium italic mb-2 font-serif">
              "How well do you know Scripture?"
            </p>

            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              Test Your Knowledge • Challenge Your Friends • Master Scripture
            </p>
          </div>

          {/* PRIMARY ACTION TRIO (Play Now / Create / Join) */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto">
            {/* Play Now (Primary) */}
            <button
              onClick={handlePlayNow}
              className="w-full sm:w-auto flex-1 gold-button py-3.5 px-6 rounded-xl flex items-center justify-center gap-2.5 text-slate-950 font-black text-sm uppercase tracking-wider transition-all"
            >
              <Play size={18} fill="currentColor" />
              <span>Play Now</span>
            </button>

            {/* Create Challenge (Secondary) */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full sm:w-auto flex-1 py-3.5 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-amber-500/30 text-slate-200 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Plus size={16} className="text-amber-400" />
              <span>Create Challenge</span>
            </button>

            {/* Join Challenge (Secondary) */}
            <button
              onClick={() => {
                setCustomJoinInput('');
                setIsJoinModalOpen(true);
              }}
              className="w-full sm:w-auto flex-1 py-3.5 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-indigo-500/30 text-slate-200 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Users size={16} className="text-indigo-400" />
              <span>Join Challenge</span>
            </button>
          </div>
        </section>

        {/* FEATURED / DAILY CHALLENGE SECTION */}
        <section className="sacred-card rounded-2xl p-4 sm:p-5 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Featured Challenge
                </span>
                <span className="text-xs text-slate-400 font-mono">Room #{challengeCode}</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Can you beat today's Bible challenge?</span>
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                <span>📖 35 Questions</span>
                <span>•</span>
                <span>⏱️ {activeMode.name} ({activeMode.label})</span>
                <span>•</span>
                <span>⚡ Progressive Difficulty</span>
                {userProfile.highestScore > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-amber-400 font-semibold">Best: {userProfile.highestScore.toFixed(1)} pts</span>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={handlePlayNow}
              className="w-full sm:w-auto flex-shrink-0 py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 border border-amber-500/50 text-amber-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Play size={14} fill="currentColor" />
              <span>Launch Match</span>
            </button>
          </div>
        </section>

        {/* CHALLENGE DURATION MODE CARDS */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Clock size={14} className="text-amber-400" />
              <span>Select Challenge Duration</span>
            </label>
            <span className="text-[11px] text-amber-300/80 font-medium">
              Mode: <span className="font-bold text-white">{activeMode.name}</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {CHALLENGE_MODES.map((mode) => {
              const isSelected = selectedDuration === mode.seconds;
              const IconComp = mode.icon;

              return (
                <button
                  key={mode.seconds}
                  onClick={() => setSelectedDuration(mode.seconds)}
                  className={`relative p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-28 sacred-card-interactive ${
                    isSelected
                      ? 'bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900 border-amber-500/80 text-white shadow-[0_0_16px_rgba(245,158,11,0.22)] ring-1 ring-amber-400/40'
                      : 'bg-slate-900/80 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-base font-black tracking-tight font-mono ${isSelected ? 'text-amber-400' : 'text-slate-200'}`}>
                      {mode.label}
                    </span>
                    <IconComp size={16} className={isSelected ? 'text-amber-400' : 'text-slate-500'} />
                  </div>

                  <div>
                    <div className={`font-bold text-xs leading-snug ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {mode.name}
                    </div>
                    <div className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-tight opacity-90">
                      {mode.tagline}
                    </div>
                  </div>

                  <div className="text-[9px] font-semibold text-amber-400/80 uppercase tracking-tight">
                    {mode.difficulty}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* MATCH SEED & NETWORK MODE BAR */}
        <section className="sacred-card rounded-xl p-3.5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Room Code Indicator */}
            <div className="flex items-center gap-2.5 flex-1">
              <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
                <Hash size={16} />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                  Cross-Play Seed Code
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-black text-amber-300 tracking-wider">
                    {challengeCode}
                  </span>
                  <button
                    onClick={() => setChallengeCode(generateRandomSeed())}
                    className="p-1 rounded text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors text-xs flex items-center gap-1"
                    title="Generate new seed"
                  >
                    <Shuffle size={12} />
                    <span className="text-[10px]">Randomize</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Online Toggle */}
            <div className="flex items-center gap-3 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
              <Globe size={16} className={isOnlineMode ? 'text-emerald-400' : 'text-slate-500'} />
              <div className="text-right">
                <div className="text-xs font-semibold text-slate-200">
                  {isOnlineMode ? 'Online Ranked' : 'Offline Practice'}
                </div>
              </div>
              <input
                type="checkbox"
                checked={isOnlineMode}
                onChange={(e) => setIsOnlineMode(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                aria-label="Toggle Online Mode"
              />
            </div>
          </div>
        </section>

        {/* KEYBOARD SHORTCUT HELPER */}
        <div className="text-center pb-1">
          <p className="text-[11px] text-slate-500 font-medium">
            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-300 font-mono text-[10px]">Space</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-300 font-mono text-[10px]">Enter</kbd> to launch
          </p>
        </div>
      </main>

      {/* CREATE CHALLENGE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="sacred-card w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 font-bold text-white text-base">
                <Plus size={18} className="text-amber-400" />
                <span>Create Challenge Room</span>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Share this Room Code with friends on any platform (Web, Android, iOS, Desktop) so everyone plays the exact same questions!
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Room Match Code (Deterministic Seed)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={10}
                  value={challengeCode}
                  onChange={(e) => setChallengeCode(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-750 font-mono text-base font-bold text-amber-300 tracking-wider focus:outline-none focus:border-amber-400 uppercase"
                />
                <button
                  type="button"
                  onClick={() => setChallengeCode(generateRandomSeed())}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors"
                  title="Generate new code"
                >
                  <Shuffle size={18} />
                </button>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRoomConfirm}
                className="flex-1 gold-button py-2.5 rounded-xl text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <Play size={14} fill="currentColor" />
                <span>Start Room</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* JOIN CHALLENGE MODAL */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="sacred-card w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 font-bold text-white text-base">
                <Users size={18} className="text-indigo-400" />
                <span>Join Challenge Room</span>
              </div>
              <button
                onClick={() => setIsJoinModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Enter the room code shared by your friend or tournament host to synchronize questions:
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Enter Room Code
              </label>
              <input
                type="text"
                maxLength={10}
                value={customJoinInput}
                onChange={(e) => setCustomJoinInput(e.target.value.toUpperCase())}
                placeholder="e.g. FAITH12"
                autoFocus
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-750 font-mono text-base font-bold text-amber-300 tracking-wider focus:outline-none focus:border-amber-400 uppercase"
              />
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setIsJoinModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleJoinConfirm}
                disabled={!customJoinInput.trim()}
                className="flex-1 gold-button py-2.5 rounded-xl text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogIn size={14} />
                <span>Join & Start</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
