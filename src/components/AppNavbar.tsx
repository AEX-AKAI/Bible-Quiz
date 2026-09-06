import React, { useState } from 'react';
import { 
  Home, 
  Trophy, 
  Sliders, 
  Award, 
  BookOpen, 
  Menu, 
  X, 
  User,
  Sparkles,
  Zap
} from 'lucide-react';

export type NavTab = 'HOME' | 'CHALLENGES' | 'LEADERBOARD' | 'SETTINGS';

interface Props {
  activeTab?: NavTab;
  onNavigate: (tab: NavTab) => void;
  onOpenProfile?: () => void;
  onExitQuiz?: () => void;
  isQuizActive?: boolean;
}

export const AppNavbar: React.FC<Props> = ({
  activeTab = 'HOME',
  onNavigate,
  onOpenProfile,
  onExitQuiz,
  isQuizActive = false,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: NavTab) => {
    setIsMobileMenuOpen(false);
    onNavigate(tab);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/85 dark:bg-slate-950/85 bg-white/90 border-b border-amber-500/15 transition-colors pt-[max(4px,var(--safe-area-top))] shadow-md">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between">
        
        {/* 1. BRAND LOGO (Left) */}
        <button
          onClick={() => handleNavClick('HOME')}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          {/* Radiant Glowing Bible Emblem */}
          <div className="relative flex items-center justify-center">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/25 ring-1 ring-amber-300/50 group-hover:scale-105 transition-transform">
              <BookOpen size={20} className="text-slate-950" />
            </div>
            {/* Subtle glow aura */}
            <div className="absolute -inset-1 rounded-xl bg-amber-400/20 blur-sm pointer-events-none -z-10" />
          </div>

          <div>
            <div className="font-display font-black text-base sm:text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-400 group-hover:to-amber-200 transition-all">
              BIBLE QUIZ
            </div>
            <div className="text-[9px] sm:text-[10px] tracking-[0.2em] font-extrabold uppercase text-amber-500/90 dark:text-amber-400/90">
              KNOW • GROW • SHINE
            </div>
          </div>
        </button>

        {/* 2. DESKTOP NAVIGATION (Center-Right) */}
        {!isQuizActive ? (
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/70 dark:bg-slate-900/70 bg-stone-100/90 p-1.5 rounded-2xl border border-amber-500/20 dark:border-amber-500/20 border-stone-200 shadow-inner">
            {/* Home */}
            <button
              onClick={() => handleNavClick('HOME')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'HOME'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Home size={14} className={activeTab === 'HOME' ? 'text-amber-400' : 'text-slate-400'} />
              <span>Home</span>
            </button>

            {/* Challenges */}
            <button
              onClick={() => handleNavClick('CHALLENGES')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'CHALLENGES'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Trophy size={14} className={activeTab === 'CHALLENGES' ? 'text-amber-400' : 'text-slate-400'} />
              <span>Challenges</span>
            </button>

            {/* Leaderboard */}
            <button
              onClick={() => handleNavClick('LEADERBOARD')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'LEADERBOARD'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Award size={14} className={activeTab === 'LEADERBOARD' ? 'text-amber-400' : 'text-slate-400'} />
              <span>Leaderboard</span>
            </button>

            {/* Settings */}
            <button
              onClick={() => handleNavClick('SETTINGS')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'SETTINGS'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Sliders size={14} className={activeTab === 'SETTINGS' ? 'text-amber-400' : 'text-slate-400'} />
              <span>Settings</span>
            </button>
          </nav>
        ) : (
          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
              Live Challenge in Progress
            </span>
          </div>
        )}

        {/* 3. RIGHT CONTROLS: Profile & Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {onOpenProfile && (
            <button
              onClick={onOpenProfile}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-amber-300 hover:border-amber-500/40 transition-all active:scale-95 shadow-sm"
              title="Player Profile"
              aria-label="Player Profile"
            >
              <User size={16} />
            </button>
          )}

          {/* Mobile Menu Button */}
          {!isQuizActive ? (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-amber-300 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          ) : (
            onExitQuiz && (
              <button
                onClick={onExitQuiz}
                className="md:hidden px-3 py-1.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-bold"
              >
                Exit
              </button>
            )
          )}
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {isMobileMenuOpen && !isQuizActive && (
        <div className="md:hidden w-full border-t border-amber-500/15 bg-slate-950/95 dark:bg-slate-950/95 bg-white/95 px-4 py-3 space-y-1.5 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => handleNavClick('HOME')}
            className={`w-full px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-colors ${
              activeTab === 'HOME'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            <Home size={18} className={activeTab === 'HOME' ? 'text-amber-400' : 'text-slate-400'} />
            <span>Home</span>
          </button>

          <button
            onClick={() => handleNavClick('CHALLENGES')}
            className={`w-full px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-colors ${
              activeTab === 'CHALLENGES'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            <Trophy size={18} className={activeTab === 'CHALLENGES' ? 'text-amber-400' : 'text-slate-400'} />
            <span>Challenges & Modes</span>
          </button>

          <button
            onClick={() => handleNavClick('LEADERBOARD')}
            className={`w-full px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-colors ${
              activeTab === 'LEADERBOARD'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            <Award size={18} className={activeTab === 'LEADERBOARD' ? 'text-amber-400' : 'text-slate-400'} />
            <span>Leaderboard Standings</span>
          </button>

          <button
            onClick={() => handleNavClick('SETTINGS')}
            className={`w-full px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-colors ${
              activeTab === 'SETTINGS'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            <Sliders size={18} className={activeTab === 'SETTINGS' ? 'text-amber-400' : 'text-slate-400'} />
            <span>Settings</span>
          </button>
        </div>
      )}
    </header>
  );
};
