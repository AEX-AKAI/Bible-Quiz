import React, { useState, useEffect } from 'react';
import { ChallengeConfig } from '../../data/models/ChallengeModels';
import { ChallengeDuration, NetworkStatus } from '../../core/types';
import { UserProfile, AppSettings } from '../../data/models/UserProfile';
import { AppNavbar } from '../../components/AppNavbar';
import { WebAudioEngine } from '../../platform/audio/WebAudioEngine';
import { HapticService } from '../../platform/haptics/HapticService';
import { 
  Play, 
  Flame, 
  Clock, 
  Shield, 
  Sparkles, 
  Hash, 
  Zap, 
  Award, 
  BookOpen, 
  Plus, 
  LogIn, 
  X, 
  Check, 
  Shuffle,
  Trophy,
  Globe,
  TrendingUp,
  Bookmark,
  ChevronRight,
  LucideIcon
} from 'lucide-react';

interface Props {
  userProfile: UserProfile;
  settings: AppSettings;
  networkStatus: NetworkStatus;
  initialTab?: 'HOME' | 'CHALLENGES';
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
  questions: number;
}

const CHALLENGE_MODES: ModeCard[] = [
  { 
    seconds: 30, 
    label: '30s Sprint', 
    name: 'Rapid Fire', 
    tagline: 'Fast scripture recall under pressure.', 
    difficulty: 'Quick Reflex', 
    icon: Zap,
    questions: 10
  },
  { 
    seconds: 60, 
    label: '1 Minute', 
    name: 'Quick Quiz', 
    tagline: 'Classic scripture sprint for daily practice.', 
    difficulty: 'Balanced', 
    icon: Clock,
    questions: 15
  },
  { 
    seconds: 180, 
    label: '3 Minutes', 
    name: 'Official Challenge', 
    tagline: 'Standard competitive ranked challenge.', 
    difficulty: 'Progressive', 
    icon: Shield,
    questions: 35
  },
  { 
    seconds: 300, 
    label: '5 Minutes', 
    name: 'Bible Battle', 
    tagline: 'Deep scriptural knowledge and endurance trial.', 
    difficulty: 'Advanced', 
    icon: Flame,
    questions: 50
  },
  { 
    seconds: 600, 
    label: '10 Minutes', 
    name: 'Bible Marathon', 
    tagline: 'The ultimate comprehensive biblical mastery trial.', 
    difficulty: 'Grand Master', 
    icon: Award,
    questions: 100
  },
];

export const LobbyView: React.FC<Props> = ({
  userProfile,
  settings,
  networkStatus,
  initialTab = 'HOME',
  onStartChallenge,
  onViewLeaderboard,
  onOpenSettings,
  onOpenProfile,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<ChallengeDuration>(180);
  const [challengeCode, setChallengeCode] = useState('ABC123');
  const [isOnlineMode, setIsOnlineMode] = useState(true);
  const [navTab, setNavTab] = useState<'HOME' | 'CHALLENGES'>(initialTab);

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

  // Keyboard shortcut: Space / Enter starts challenge when not typing in input
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

  return (
    <div className="w-full min-h-[100vh] min-h-[100dvh] flex-1 flex flex-col celestial-bg parchment-pattern dark:text-slate-100 text-stone-900 overflow-x-hidden selection:bg-amber-500/30">
      
      {/* 1. TOP NAVBAR (Matching Reference Image Header Across All Screens) */}
      <AppNavbar
        activeTab={navTab === 'HOME' ? 'HOME' : 'CHALLENGES'}
        onNavigate={(tab) => {
          if (tab === 'HOME') setNavTab('HOME');
          else if (tab === 'CHALLENGES') setNavTab('CHALLENGES');
          else if (tab === 'LEADERBOARD') onViewLeaderboard && onViewLeaderboard();
          else if (tab === 'SETTINGS') onOpenSettings();
        }}
        onOpenProfile={onOpenProfile}
      />

      {/* 2. MAIN VIEWPORT (HOME OR CHALLENGES) */}
      {navTab === 'HOME' ? (
        /* HOME PAGE: Screens 1 & 7 from Reference Image */
        <main className="w-full max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 flex flex-col justify-between relative">
          
          {/* Radiant Heavenly Light Beam & Cross in Upper Right Background */}
          <div className="absolute top-0 right-4 sm:right-12 lg:right-24 pointer-events-none opacity-40 sm:opacity-60 -z-10">
            {/* Ambient Golden Beam */}
            <div className="w-72 sm:w-96 h-96 bg-gradient-to-b from-amber-400/20 via-amber-500/10 to-transparent blur-3xl rounded-full transform rotate-12" />
            {/* Glowing Cross Graphic */}
            <div className="absolute top-8 right-12 text-amber-300/80 filter drop-shadow-[0_0_24px_rgba(245,158,11,0.6)]">
              <svg width="64" height="96" viewBox="0 0 64 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M28 0H36V96H28V0Z" fill="url(#cross-glow)" />
                <path d="M0 24H64V32H0V24Z" fill="url(#cross-glow)" />
                <defs>
                  <linearGradient id="cross-glow" x1="32" y1="0" x2="32" y2="96" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FCD34D" />
                    <stop offset="0.5" stopColor="#F59E0B" />
                    <stop offset="1" stopColor="#D97706" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* HERO CENTERPIECE (Matching Screen 1 & 7) */}
          <div className="my-auto text-center max-w-3xl mx-auto px-2 pt-4 sm:pt-8 pb-6 sm:pb-10">
            
            {/* Main Title: Test Your Bible Knowledge */}
            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight sm:leading-none mb-3 sm:mb-4 drop-shadow-md">
              Test Your <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-400">
                Bible Knowledge
              </span>
            </h1>

            {/* Subtitle: Explore the Word • Grow in Faith • Shine for Christ */}
            <p className="text-sm sm:text-base md:text-lg text-amber-100/90 font-medium tracking-wide mb-8 sm:mb-10 font-sans">
              Explore the Word &bull; Grow in Faith &bull; Shine for Christ
            </p>

            {/* Prominent Golden Button: ▶ Start Challenge */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-10">
              <button
                onClick={handlePlayNow}
                className="w-full sm:w-auto flex-1 gold-button py-4 px-8 rounded-2xl flex items-center justify-center gap-3 text-slate-950 font-black text-base uppercase tracking-wider transition-all shadow-xl shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Play size={20} fill="currentColor" />
                <span>Start Challenge</span>
              </button>
            </div>

            {/* 4 FEATURE CARDS ROW (Matching Screen 1 & 7) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto text-left">
              {/* Card 1: Multiple Categories */}
              <div 
                onClick={() => setNavTab('CHALLENGES')}
                className="sacred-card sacred-card-interactive p-4 sm:p-5 rounded-2xl border border-amber-500/20 flex flex-col items-center text-center cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                  <BookOpen size={20} />
                </div>
                <div className="font-bold text-xs sm:text-sm text-white group-hover:text-amber-300 transition-colors">
                  Multiple Categories
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Old & New Testament
                </div>
              </div>

              {/* Card 2: Progressive Difficulty */}
              <div 
                onClick={() => setNavTab('CHALLENGES')}
                className="sacred-card sacred-card-interactive p-4 sm:p-5 rounded-2xl border border-amber-500/20 flex flex-col items-center text-center cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                  <TrendingUp size={20} />
                </div>
                <div className="font-bold text-xs sm:text-sm text-white group-hover:text-amber-300 transition-colors">
                  Progressive Difficulty
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Keep Growing
                </div>
              </div>

              {/* Card 3: Scripture References */}
              <div 
                onClick={() => setNavTab('CHALLENGES')}
                className="sacred-card sacred-card-interactive p-4 sm:p-5 rounded-2xl border border-amber-500/20 flex flex-col items-center text-center cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                  <Bookmark size={20} />
                </div>
                <div className="font-bold text-xs sm:text-sm text-white group-hover:text-amber-300 transition-colors">
                  Scripture References
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Learn & Remember
                </div>
              </div>

              {/* Card 4: Leaderboards */}
              <div 
                onClick={() => onViewLeaderboard && onViewLeaderboard()}
                className="sacred-card sacred-card-interactive p-4 sm:p-5 rounded-2xl border border-amber-500/20 flex flex-col items-center text-center cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                  <Trophy size={20} />
                </div>
                <div className="font-bold text-xs sm:text-sm text-white group-hover:text-amber-300 transition-colors">
                  Leaderboards
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Compete & Inspire
                </div>
              </div>
            </div>

          </div>

          {/* FOOTER SCRIPTURE & FOUNDATION SEAL (Matching Screen 1 & 7) */}
          <footer className="w-full text-center pt-6 pb-2 border-t border-amber-500/10 space-y-2">
            <p className="text-xs sm:text-sm font-serif italic text-amber-200/90 max-w-xl mx-auto">
              "Your word is a lamp for my feet, a light on my path." &mdash; Psalm 119:105
            </p>
            <div className="text-[10px] tracking-[0.25em] font-extrabold uppercase text-slate-500">
              TESTIFY FOUNDATION &bull; FAITH &bull; KNOWLEDGE &bull; A BRIGHTER TOMORROW
            </div>
          </footer>

        </main>
      ) : (
        /* CHALLENGES & MODES TAB (Full Screen Game Mode Layout) */
        <main className="w-full max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 flex flex-col space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-500/15">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-amber-500 dark:text-amber-400">
                Official Competitive Modes
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                Select Challenge Mode
              </h1>
            </div>

            {/* Room Code & Online Toggle */}
            <div className="flex items-center gap-3 bg-slate-900/80 px-3.5 py-1.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-slate-400">Seed:</span>
                <span className="font-mono text-xs font-bold text-amber-300">{challengeCode}</span>
                <button
                  onClick={() => setChallengeCode(generateRandomSeed())}
                  className="p-1 text-slate-400 hover:text-amber-300"
                  title="Randomize Room Seed"
                >
                  <Shuffle size={12} />
                </button>
              </div>
              <div className="h-4 w-px bg-slate-800" />
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <Globe size={14} className={isOnlineMode ? 'text-emerald-400' : 'text-slate-500'} />
                <span>{isOnlineMode ? 'Online' : 'Solo'}</span>
              </div>
            </div>
          </div>

          {/* GAME MODES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 flex-1">
            {CHALLENGE_MODES.map((mode) => {
              const Icon = mode.icon;
              const isSelected = selectedDuration === mode.seconds;
              return (
                <div
                  key={mode.seconds}
                  onClick={() => handleSelectMode(mode.seconds)}
                  className={`sacred-card p-5 sm:p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-400 bg-slate-900/90 shadow-lg shadow-amber-500/15 ring-1 ring-amber-400/40'
                      : 'border-amber-500/20 hover:border-amber-500/40 hover:bg-slate-900/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
                        <Icon size={20} />
                      </div>
                      <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-800 text-amber-300 border border-slate-700">
                        {mode.label}
                      </span>
                    </div>

                    <h2 className="font-display text-lg sm:text-xl font-bold text-white mb-1">
                      {mode.name}
                    </h2>
                    
                    <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                      {mode.tagline}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Difficulty</span>
                      <span className="font-semibold text-slate-200">{mode.difficulty}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Questions</span>
                      <span className="font-semibold text-slate-200">{mode.questions} Questions</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLaunchWithCode(challengeCode, mode.seconds);
                      }}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'gold-button text-slate-950 shadow-md'
                          : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700'
                      }`}
                    >
                      <Play size={14} fill="currentColor" />
                      <span>Start {mode.name}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* MULTIPLAYER / LOBBY ACTIONS */}
          <div className="sacred-card p-4 sm:p-5 rounded-2xl border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-white">Cross-Play Challenge Match</div>
              <div className="text-xs text-slate-400">Compete synchronously or share seeds with other believers worldwide.</div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs border border-slate-700"
              >
                Create Room
              </button>
              <button
                onClick={() => setIsJoinModalOpen(true)}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs border border-slate-700"
              >
                Join with Code
              </button>
            </div>
          </div>

        </main>
      )}

      {/* CREATE ROOM MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="sacred-card w-full max-w-sm rounded-2xl p-5 border border-amber-500/30 text-white space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="font-bold text-sm">Create Cross-Play Challenge</div>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-1">Generated Challenge Seed:</div>
              <div className="flex items-center gap-2">
                <div className="font-mono text-lg font-black text-amber-300 bg-slate-900 px-3 py-2 rounded-xl border border-amber-500/30 flex-1 text-center">
                  {challengeCode}
                </div>
                <button
                  onClick={() => setChallengeCode(generateRandomSeed())}
                  className="p-2.5 bg-slate-800 rounded-xl text-slate-300 hover:text-white border border-slate-700"
                >
                  <Shuffle size={16} />
                </button>
              </div>
            </div>
            <button
              onClick={handleCreateRoomConfirm}
              className="w-full gold-button py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950"
            >
              Launch Room Now
            </button>
          </div>
        </div>
      )}

      {/* JOIN ROOM MODAL */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="sacred-card w-full max-w-sm rounded-2xl p-5 border border-amber-500/30 text-white space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="font-bold text-sm">Join Challenge by Code</div>
              <button onClick={() => setIsJoinModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-1">Enter Room Seed:</div>
              <input
                type="text"
                value={customJoinInput}
                onChange={(e) => setCustomJoinInput(e.target.value.toUpperCase())}
                placeholder="e.g. GRACE24"
                className="w-full font-mono text-center text-lg font-bold bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 focus:outline-none focus:border-amber-400"
                maxLength={10}
              />
            </div>
            <button
              onClick={handleJoinConfirm}
              disabled={!customJoinInput.trim()}
              className="w-full gold-button py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 disabled:opacity-50"
            >
              Join Challenge
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
