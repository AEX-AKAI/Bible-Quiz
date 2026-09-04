import React, { useState, useEffect } from 'react';
import { ChallengeConfig } from '../../data/models/ChallengeModels';
import { ChallengeDuration, NetworkStatus } from '../../core/types';
import { UserProfile, AppSettings } from '../../data/models/UserProfile';
import { NetworkStatusBadge } from '../../components/NetworkStatusBadge';
import { HeroIllustration } from '../../components/HeroIllustration';
import { WebAudioEngine } from '../../platform/audio/WebAudioEngine';
import { HapticService } from '../../platform/haptics/HapticService';
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
  Trophy,
  Compass,
  ArrowRight,
  LucideIcon
} from 'lucide-react';

interface Props {
  userProfile: UserProfile;
  settings: AppSettings;
  networkStatus: NetworkStatus;
  onStartChallenge: (config: ChallengeConfig) => void;
  onViewLeaderboard?: (config?: ChallengeConfig) => void;
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
    label: '30 SEC', 
    name: 'RAPID FIRE', 
    tagline: 'Fast answers. Faster thinking.', 
    difficulty: 'Quick Reflex', 
    icon: Zap,
    accentColor: 'from-amber-400 to-yellow-500'
  },
  { 
    seconds: 60, 
    label: '1 MIN', 
    name: 'QUICK QUIZ', 
    tagline: 'Classic scripture sprint.', 
    difficulty: 'Balanced', 
    icon: Clock,
    accentColor: 'from-amber-500 to-amber-600'
  },
  { 
    seconds: 180, 
    label: '3 MIN', 
    name: 'CHALLENGE', 
    tagline: 'Balanced competitive trial.', 
    difficulty: 'Official Ranked', 
    icon: Shield,
    accentColor: 'from-amber-500 to-indigo-600'
  },
  { 
    seconds: 300, 
    label: '5 MIN', 
    name: 'BIBLE BATTLE', 
    tagline: 'Deep knowledge endurance.', 
    difficulty: 'High Stamina', 
    icon: Flame,
    accentColor: 'from-orange-500 to-rose-600'
  },
  { 
    seconds: 600, 
    label: '10 MIN', 
    name: 'BIBLE MARATHON', 
    tagline: 'The ultimate mastery test.', 
    difficulty: 'Grand Mastery', 
    icon: Award,
    accentColor: 'from-amber-300 via-yellow-400 to-amber-600'
  },
];

export const LobbyView: React.FC<Props> = ({
  userProfile,
  settings,
  networkStatus,
  onStartChallenge,
  onViewLeaderboard,
  onOpenSettings,
  onOpenProfile,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<ChallengeDuration>(180);
  const [challengeCode, setChallengeCode] = useState('ABC123');
  const [isOnlineMode, setIsOnlineMode] = useState(true);
  const [navTab, setNavTab] = useState<'HOME' | 'CHALLENGES'>('HOME');

  // Modal dialog states for Create & Join Challenge
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [customJoinInput, setCustomJoinInput] = useState('');

  const audio = WebAudioEngine.getInstance();
  const haptics = HapticService.getInstance();

  const generateRandomSeed = () => {
    const prefixes = ['GRACE', 'FAITH', 'HOPE', 'GLORY', 'PSALM', 'PEACE', 'LIGHT', 'TRUTH'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNum = Math.floor(10 + Math.random() * 90);
    return `${randomPrefix}${randomNum}`;
  };

  const handleLaunchWithCode = (seed: string, duration: ChallengeDuration = selectedDuration) => {
    audio.playActionSound();
    haptics.mediumTap();
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

  const handleSelectMode = (duration: ChallengeDuration) => {
    audio.playButtonTap();
    haptics.lightTap();
    setSelectedDuration(duration);
  };

  const handleTabSwitch = (tab: 'HOME' | 'CHALLENGES') => {
    audio.playTabSound();
    haptics.lightTap();
    setNavTab(tab);
  };

  const handleOpenLeaderboard = () => {
    audio.playTabSound();
    haptics.lightTap();
    if (onViewLeaderboard) {
      onViewLeaderboard({
        challengeId: challengeCode,
        seed: challengeCode,
        timeLimitSeconds: selectedDuration,
        difficulty: 'MIXED',
        isOnline: isOnlineMode,
        totalQuestions: 35,
      });
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
    <div className="flex-1 flex flex-col celestial-bg parchment-pattern text-slate-100 overflow-y-auto selection:bg-amber-500/30 pb-[max(76px,calc(60px+var(--safe-area-bottom)))] sm:pb-6">
      {/* 1. TOP APP BAR & DESKTOP NAVIGATION */}
      <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-slate-950/70 border-b border-amber-500/10 pt-[max(4px,var(--safe-area-top))]">
        <div className="max-w-3xl mx-auto px-4 py-2.5 flex items-center justify-between">
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

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => handleTabSwitch('HOME')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                navTab === 'HOME'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Compass size={14} />
              <span>Home</span>
            </button>
            <button
              onClick={() => handleTabSwitch('CHALLENGES')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                navTab === 'CHALLENGES'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock size={14} />
              <span>Modes</span>
            </button>
            <button
              onClick={handleOpenLeaderboard}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-amber-300 transition-all flex items-center gap-1.5"
            >
              <Trophy size={14} />
              <span>Standings</span>
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <NetworkStatusBadge status={networkStatus} />
            <button
              onClick={() => {
                audio.playButtonTap();
                haptics.lightTap();
                onOpenProfile();
              }}
              className="p-2 rounded-xl bg-slate-900/80 border border-slate-750 text-slate-300 hover:text-amber-300 hover:border-amber-500/40 transition-all active:scale-95"
              title="Player Profile"
              aria-label="Player Profile"
            >
              <User size={16} />
            </button>
            <button
              onClick={() => {
                audio.playButtonTap();
                haptics.lightTap();
                onOpenSettings();
              }}
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
        
        {navTab === 'HOME' ? (
          <>
            {/* HERO SECTION */}
            <section className="relative text-center pt-1 pb-3">
              {/* Subtle Ambient Ray/Glow Behind Hero */}
              <div className="absolute inset-0 -top-6 flex items-center justify-center pointer-events-none opacity-40">
                <div className="w-80 h-32 bg-amber-500/15 blur-3xl rounded-full" />
              </div>

              <div className="relative z-10">
                {/* Elegant Scripture Badge */}
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold mb-2 shadow-sm">
                  <Sparkles size={13} className="text-amber-400" />
                  <span>Thy Word is a lamp unto my feet</span>
                </div>

                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-1.5 leading-tight">
                  BIBLE QUIZ
                </h1>
                
                <p className="text-sm sm:text-base text-amber-100/90 font-medium italic mb-1.5 font-serif">
                  "How well do you know Scripture?"
                </p>

                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                  Test Your Knowledge • Challenge Your Friends • Master Scripture
                </p>

                {/* Cinematic Sacred Manuscript Hero Visual */}
                <HeroIllustration className="my-2.5 max-h-44" />
              </div>

              {/* PRIMARY ACTION TRIO (Play Now / Create / Join) */}
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto">
                {/* Play Now (Primary) */}
                <button
                  onClick={handlePlayNow}
                  className="w-full sm:w-auto flex-1 gold-button py-3.5 px-6 rounded-xl flex items-center justify-center gap-2.5 text-slate-950 font-black text-sm uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20"
                >
                  <Play size={18} fill="currentColor" />
                  <span>Play Now</span>
                </button>

                {/* Create Challenge (Secondary) */}
                <button
                  onClick={() => {
                    audio.playButtonTap();
                    haptics.lightTap();
                    setIsCreateModalOpen(true);
                  }}
                  className="w-full sm:w-auto flex-1 py-3.5 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-amber-500/30 text-slate-200 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
                >
                  <Plus size={16} className="text-amber-400" />
                  <span>Create Challenge</span>
                </button>

                {/* Join Challenge (Secondary) */}
                <button
                  onClick={() => {
                    audio.playButtonTap();
                    haptics.lightTap();
                    setCustomJoinInput('');
                    setIsJoinModalOpen(true);
                  }}
                  className="w-full sm:w-auto flex-1 py-3.5 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-indigo-500/30 text-slate-200 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
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
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <Sparkles size={11} className="text-amber-400" />
                      <span>TODAY'S CHALLENGE</span>
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
                    {userProfile.highestScore > 0 ? (
                      <>
                        <span>•</span>
                        <span className="text-amber-400 font-semibold">Best: {userProfile.highestScore.toFixed(1)} pts</span>
                      </>
                    ) : (
                      <>
                        <span>•</span>
                        <span className="text-slate-400">First attempt</span>
                      </>
                    )}
                  </div>
                </div>

                <button
                  onClick={handlePlayNow}
                  className="w-full sm:w-auto flex-shrink-0 gold-button py-2.5 px-6 rounded-xl text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all active:scale-95"
                >
                  <Play size={14} fill="currentColor" />
                  <span>PLAY</span>
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
                      onClick={() => handleSelectMode(mode.seconds)}
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
          </>
        ) : (
          /* EXPANDED CHALLENGE MODES SHOWCASE TAB */
          <section className="space-y-4">
            <div className="text-center pb-2">
              <h2 className="font-display text-2xl font-bold text-white tracking-wide">
                Select Your Challenge Mode
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Choose the intensity and time limit for your Scripture trial
              </p>
            </div>

            <div className="space-y-3">
              {CHALLENGE_MODES.map((mode) => {
                const isSelected = selectedDuration === mode.seconds;
                const IconComp = mode.icon;

                return (
                  <div
                    key={mode.seconds}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected
                        ? 'sacred-card border-amber-500/80 shadow-[0_0_20px_rgba(245,158,11,0.2)] ring-1 ring-amber-400/40'
                        : 'bg-slate-900/80 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                        <IconComp size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                            {mode.label}
                          </span>
                          <h3 className="font-bold text-base text-white">{mode.name}</h3>
                          <span className="text-[10px] text-amber-400/90 font-medium">({mode.difficulty})</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{mode.tagline}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 self-end sm:self-auto">
                      <button
                        onClick={() => handleSelectMode(mode.seconds)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                          isSelected
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Select'}
                      </button>
                      <button
                        onClick={() => handleLaunchWithCode(challengeCode, mode.seconds)}
                        className="gold-button px-4 py-2 rounded-xl text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5"
                      >
                        <Play size={13} fill="currentColor" />
                        <span>Launch</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

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
                    onClick={() => {
                      audio.playButtonTap();
                      haptics.lightTap();
                      setChallengeCode(generateRandomSeed());
                    }}
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
                onChange={(e) => {
                  audio.playButtonTap();
                  haptics.lightTap();
                  setIsOnlineMode(e.target.checked);
                }}
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

      {/* 3. MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-slate-950/95 border-t border-amber-500/15 backdrop-blur-lg px-4 pt-2 pb-[max(8px,var(--safe-area-bottom))] flex items-center justify-around">
        <button
          onClick={() => handleTabSwitch('HOME')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg transition-colors ${
            navTab === 'HOME' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Compass size={18} />
          <span className="text-[10px]">Home</span>
        </button>
        <button
          onClick={() => handleTabSwitch('CHALLENGES')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg transition-colors ${
            navTab === 'CHALLENGES' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Clock size={18} />
          <span className="text-[10px]">Modes</span>
        </button>
        <button
          onClick={handleOpenLeaderboard}
          className="flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg text-slate-400 hover:text-amber-300 transition-colors"
        >
          <Trophy size={18} />
          <span className="text-[10px]">Standings</span>
        </button>
        <button
          onClick={() => {
            audio.playButtonTap();
            haptics.lightTap();
            onOpenProfile();
          }}
          className="flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg text-slate-400 hover:text-amber-300 transition-colors"
        >
          <User size={18} />
          <span className="text-[10px]">Profile</span>
        </button>
        <button
          onClick={() => {
            audio.playButtonTap();
            haptics.lightTap();
            onOpenSettings();
          }}
          className="flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg text-slate-400 hover:text-amber-300 transition-colors"
        >
          <Sliders size={18} />
          <span className="text-[10px]">Settings</span>
        </button>
      </nav>

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
                  onClick={() => {
                    audio.playButtonTap();
                    haptics.lightTap();
                    setChallengeCode(generateRandomSeed());
                  }}
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
