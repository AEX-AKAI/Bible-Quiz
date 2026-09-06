import React, { useState } from 'react';
import { AppSettings, UserProfile } from '../../data/models/UserProfile';
import { AppNavbar } from '../../components/AppNavbar';
import { WebAudioEngine } from '../../platform/audio/WebAudioEngine';
import { HapticService } from '../../platform/haptics/HapticService';
import { 
  Settings as SettingsIcon, 
  Volume2, 
  VolumeX, 
  Music, 
  Palette, 
  Gamepad2, 
  User, 
  Info, 
  Check, 
  Sparkles, 
  BookOpen, 
  Smartphone, 
  ChevronRight,
  Sun,
  Moon,
  Shield,
  Bell
} from 'lucide-react';

interface Props {
  settings: AppSettings;
  userProfile: UserProfile;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onNavigate: (tab: 'HOME' | 'CHALLENGES' | 'LEADERBOARD' | 'SETTINGS') => void;
  onOpenProfile: () => void;
}

type SettingsSection = 'GENERAL' | 'AUDIO' | 'APPEARANCE' | 'GAMEPLAY' | 'ACCOUNT' | 'ABOUT';

export const SettingsView: React.FC<Props> = ({
  settings,
  userProfile,
  onUpdateSettings,
  onNavigate,
  onOpenProfile,
}) => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('GENERAL');
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [saveToast, setSaveToast] = useState(false);

  const audio = WebAudioEngine.getInstance();
  const haptics = HapticService.getInstance();

  const handleToggle = (key: keyof AppSettings) => {
    audio.playButtonTap();
    haptics.lightTap();
    setLocalSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSlider = (key: 'masterVolume' | 'ambientVolume' | 'soundEffectsVolume', val: number) => {
    setLocalSettings((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const handleSaveChanges = () => {
    audio.playActionSound();
    haptics.mediumTap();
    onUpdateSettings(localSettings);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <div className="w-full min-h-[100vh] min-h-[100dvh] flex-1 flex flex-col celestial-bg parchment-pattern dark:text-slate-100 text-stone-900 overflow-x-hidden selection:bg-amber-500/30 pb-12">
      {/* 1. TOP NAVBAR */}
      <AppNavbar
        activeTab="SETTINGS"
        onNavigate={onNavigate}
        onOpenProfile={onOpenProfile}
      />

      {/* 2. MAIN SETTINGS CONTAINER */}
      <main className="w-full max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 flex flex-col">
        
        {/* Header Title on Mobile / Tablet */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-500 dark:text-amber-400 mb-1">
            <SettingsIcon size={14} />
            <span>Preferences & Customization</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Customize your Bible Quiz experience, audio levels, appearance, and challenge pacing.
          </p>
        </div>

        {/* 3-COLUMN / 2-COLUMN DESKTOP LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
          
          {/* LEFT SIDEBAR: Settings Tabs (Desktop) */}
          <div className="lg:col-span-3 space-y-1.5 sacred-card p-2.5 rounded-2xl border border-amber-500/20">
            {[
              { id: 'GENERAL', label: 'General', icon: SettingsIcon },
              { id: 'AUDIO', label: 'Audio', icon: Volume2 },
              { id: 'APPEARANCE', label: 'Appearance', icon: Palette },
              { id: 'GAMEPLAY', label: 'Game Play', icon: Gamepad2 },
              { id: 'ACCOUNT', label: 'Account', icon: User },
              { id: 'ABOUT', label: 'About', icon: Info },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    audio.playTabSound();
                    haptics.lightTap();
                    setActiveSection(tab.id as SettingsSection);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className={isActive ? 'text-amber-400' : 'text-slate-400'} />
                    <span>{tab.label}</span>
                  </div>
                  <ChevronRight size={14} className={isActive ? 'opacity-100 text-amber-400' : 'opacity-30'} />
                </button>
              );
            })}
          </div>

          {/* CENTER / MAIN SETTINGS PANEL */}
          <div className="lg:col-span-6 sacred-card rounded-2xl p-5 sm:p-7 border border-amber-500/20 shadow-xl space-y-5">
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span>Preferences</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Customize your Bible Quiz experience.
              </p>
            </div>

            {/* TOGGLE SETTINGS LIST (Matching Reference Image Screen 6 & 12) */}
            <div className="space-y-3 divide-y divide-slate-800/60">
              
              {/* Theme (Dark Default / Light) */}
              <div className="flex items-center justify-between pt-3 first:pt-0">
                <div>
                  <div className="text-sm font-bold text-white">Theme</div>
                  <div className="text-xs text-slate-400">Midnight celestial dark mode</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('darkMode')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                    localSettings.darkMode
                      ? 'bg-slate-900 border-amber-500/40 text-amber-300 shadow-sm'
                      : 'bg-amber-100 border-amber-500/40 text-amber-900'
                  }`}
                >
                  {localSettings.darkMode ? <Moon size={13} /> : <Sun size={13} />}
                  <span>{localSettings.darkMode ? 'Dark (Default)' : 'Light Parchment'}</span>
                </button>
              </div>

              {/* Sound Effects */}
              <div className="flex items-center justify-between pt-3">
                <div>
                  <div className="text-sm font-bold text-white">Sound Effects</div>
                  <div className="text-xs text-slate-400">Audio cues for correct answers, combos and fanfares</div>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.soundEffectsEnabled}
                  onChange={() => handleToggle('soundEffectsEnabled')}
                  className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                  aria-label="Toggle Sound Effects"
                />
              </div>

              {/* Background Music / Ambient */}
              <div className="flex items-center justify-between pt-3">
                <div>
                  <div className="text-sm font-bold text-white">Background Music</div>
                  <div className="text-xs text-slate-400">Peaceful celestial synthesizer soundscape</div>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.ambientSoundEnabled}
                  onChange={() => handleToggle('ambientSoundEnabled')}
                  className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                  aria-label="Toggle Background Music"
                />
              </div>

              {/* Show Scripture References */}
              <div className="flex items-center justify-between pt-3">
                <div>
                  <div className="text-sm font-bold text-white">Show Scripture References</div>
                  <div className="text-xs text-slate-400">Display biblical book and verse citations</div>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.masterAudioEnabled}
                  onChange={() => handleToggle('masterAudioEnabled')}
                  className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                  aria-label="Toggle Scripture References"
                />
              </div>

              {/* Haptic Feedback (Mobile) */}
              <div className="flex items-center justify-between pt-3">
                <div>
                  <div className="text-sm font-bold text-white">Haptic Feedback (Mobile)</div>
                  <div className="text-xs text-slate-400">Tactile vibrations on tap and score milestones</div>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.hapticFeedbackEnabled}
                  onChange={() => handleToggle('hapticFeedbackEnabled')}
                  className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                  aria-label="Toggle Haptic Feedback"
                />
              </div>

              {/* Auto-advance to next question */}
              <div className="flex items-center justify-between pt-3">
                <div>
                  <div className="text-sm font-bold text-white">Auto-advance to next question</div>
                  <div className="text-xs text-slate-400">Smoothly transition immediately after answer feedback</div>
                </div>
                <input
                  type="checkbox"
                  checked={!localSettings.reduceAnimations}
                  onChange={() => handleToggle('reduceAnimations')}
                  className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                  aria-label="Toggle Auto-advance"
                />
              </div>

              {/* Difficulty Dropdown */}
              <div className="flex items-center justify-between pt-3">
                <div>
                  <div className="text-sm font-bold text-white">Difficulty</div>
                  <div className="text-xs text-slate-400">Question progression curve</div>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-amber-300">
                  Progressive (Recommended)
                </div>
              </div>
            </div>

            {/* SAVE CHANGES BUTTON */}
            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={handleSaveChanges}
                className="w-full gold-button py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-[0.99] transition-all"
              >
                <Check size={16} />
                <span>Save Changes</span>
              </button>

              {saveToast && (
                <div className="mt-2 text-center text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 py-1.5 px-3 rounded-lg animate-in fade-in duration-200">
                  ✓ Settings saved successfully!
                </div>
              )}
            </div>
          </div>

          {/* RIGHT VISUAL COLUMN: Cathedral Archway & Foundation Seal (Desktop) */}
          <div className="hidden lg:flex lg:col-span-3 flex-col items-center justify-center sacred-card rounded-2xl p-6 border border-amber-500/20 text-center relative overflow-hidden">
            {/* Background radiant beams */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
              <div className="w-48 h-48 bg-amber-500/20 rounded-full blur-2xl" />
            </div>

            {/* Stained-Glass / Cathedral Arch Illustration */}
            <div className="relative z-10 w-36 h-48 rounded-t-full border-2 border-amber-500/40 bg-gradient-to-b from-indigo-950/80 via-slate-900/90 to-amber-950/40 p-4 flex flex-col items-center justify-center shadow-2xl mb-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 mb-2">
                <BookOpen size={24} />
              </div>
              <div className="text-[10px] font-bold tracking-widest text-amber-300 uppercase">
                Holy Bible
              </div>
              <div className="text-[8px] text-slate-400 mt-0.5">
                Everlasting Truth
              </div>
            </div>

            <div className="font-serif italic text-sm text-amber-200/90 mb-1">
              "Grow deeper. Shine brighter."
            </div>

            <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
              TESTIFY FOUNDATION
            </div>
            <div className="text-[8px] text-slate-500 mt-0.5">
              FAITH • KNOWLEDGE • A BRIGHTER TOMORROW
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};
