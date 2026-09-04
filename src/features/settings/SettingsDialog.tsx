import React from 'react';
import { AppSettings } from '../../data/models/UserProfile';
import { Volume2, VolumeX, Music, Bell, Sparkles, Shield, X, Sliders, Moon, Sun } from 'lucide-react';

interface Props {
  settings: AppSettings;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (newSettings: AppSettings) => void;
}

export const SettingsDialog: React.FC<Props> = ({
  settings,
  isOpen,
  onClose,
  onUpdate,
}) => {
  if (!isOpen) return null;

  const toggle = (key: keyof AppSettings) => {
    onUpdate({
      ...settings,
      [key]: !settings[key],
    });
  };

  const handleSlider = (key: 'masterVolume' | 'ambientVolume' | 'soundEffectsVolume', val: number) => {
    onUpdate({
      ...settings,
      [key]: val,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="sacred-card w-full max-w-md rounded-2xl p-5 shadow-2xl dark:text-slate-100 text-stone-900 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-500/15">
          <div className="flex items-center gap-2.5 font-bold text-base dark:text-white text-stone-900">
            <Sliders size={18} className="text-amber-500 dark:text-amber-400" />
            <span className="font-display tracking-wide">Game & Audio Settings</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg dark:text-slate-400 text-stone-500 hover:dark:text-white hover:text-stone-900 hover:dark:bg-slate-800 hover:bg-stone-100 transition-colors"
            aria-label="Close Settings"
          >
            <X size={18} />
          </button>
        </div>

        {/* Settings List */}
        <div className="space-y-3 py-4 overflow-y-auto pr-1">
          {/* Theme Mode Toggle (Dark vs Light) */}
          <div className="flex items-center justify-between p-2.5 rounded-xl dark:bg-slate-900/60 bg-stone-50 border dark:border-slate-800 border-stone-200">
            <div className="flex items-center gap-3">
              {settings.darkMode ? (
                <Moon size={20} className="text-amber-400 flex-shrink-0" />
              ) : (
                <Sun size={20} className="text-amber-500 flex-shrink-0" />
              )}
              <div>
                <div className="text-sm font-semibold dark:text-white text-stone-900">Visual Appearance</div>
                <div className="text-[11px] dark:text-slate-400 text-stone-500">
                  {settings.darkMode ? 'Midnight & Gold Dark' : 'Warm Ivory Parchment Light'}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => toggle('darkMode')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors shadow-sm ${
                settings.darkMode
                  ? 'bg-slate-800 border-amber-500/40 text-amber-300'
                  : 'bg-amber-100 border-amber-500/40 text-amber-900'
              }`}
            >
              {settings.darkMode ? 'Dark Mode' : 'Light Mode'}
            </button>
          </div>

          {/* Audio Master Toggle */}
          <div className="flex items-center justify-between p-2.5 rounded-xl dark:bg-slate-900/60 bg-stone-50 border dark:border-slate-800 border-stone-200">
            <div className="flex items-center gap-3">
              {settings.masterAudioEnabled ? (
                <Volume2 size={20} className="text-amber-500 dark:text-amber-400 flex-shrink-0" />
              ) : (
                <VolumeX size={20} className="dark:text-slate-500 text-stone-400 flex-shrink-0" />
              )}
              <div>
                <div className="text-sm font-semibold dark:text-white text-stone-900">Master Audio</div>
                <div className="text-[11px] dark:text-slate-400 text-stone-500">Synthesizer sound engine & cues</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.masterAudioEnabled}
              onChange={() => toggle('masterAudioEnabled')}
              className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
            />
          </div>

          {/* Master Volume Slider */}
          {settings.masterAudioEnabled && (
            <div className="pl-3 pr-2 py-1 space-y-1">
              <div className="flex justify-between text-xs dark:text-slate-300 text-stone-600 font-medium">
                <span>Master Volume Level</span>
                <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">{Math.round(settings.masterVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.masterVolume}
                onChange={(e) => handleSlider('masterVolume', parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          )}

          {/* Ambient Music */}
          <div className="flex items-center justify-between p-2.5 rounded-xl dark:bg-slate-900/60 bg-stone-50 border dark:border-slate-800 border-stone-200">
            <div className="flex items-center gap-3">
              <Music size={20} className="text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
              <div>
                <div className="text-sm font-semibold dark:text-white text-stone-900">Peaceful Ambient Atmosphere</div>
                <div className="text-[11px] dark:text-slate-400 text-stone-500">Calm celestial background pad</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.ambientSoundEnabled}
              onChange={() => toggle('ambientSoundEnabled')}
              className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
            />
          </div>

          {/* Sound Effects */}
          <div className="flex items-center justify-between p-2.5 rounded-xl dark:bg-slate-900/60 bg-stone-50 border dark:border-slate-800 border-stone-200">
            <div className="flex items-center gap-3">
              <Sparkles size={20} className="text-yellow-500 dark:text-yellow-400 flex-shrink-0" />
              <div>
                <div className="text-sm font-semibold dark:text-white text-stone-900">Sound Effects (SFX)</div>
                <div className="text-[11px] dark:text-slate-400 text-stone-500">Chimes, combos, alerts, fanfare</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.soundEffectsEnabled}
              onChange={() => toggle('soundEffectsEnabled')}
              className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
            />
          </div>

          {/* Haptics */}
          <div className="flex items-center justify-between p-2.5 rounded-xl dark:bg-slate-900/60 bg-stone-50 border dark:border-slate-800 border-stone-200">
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
              <div>
                <div className="text-sm font-semibold dark:text-white text-stone-900">Haptic Feedback</div>
                <div className="text-[11px] dark:text-slate-400 text-stone-500">Tactile vibration on tap & answers</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.hapticFeedbackEnabled}
              onChange={() => toggle('hapticFeedbackEnabled')}
              className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
            />
          </div>

          {/* Reduce Animations */}
          <div className="flex items-center justify-between p-2.5 rounded-xl dark:bg-slate-900/60 bg-stone-50 border dark:border-slate-800 border-stone-200">
            <div className="flex items-center gap-3">
              <Sparkles size={20} className="text-rose-500 dark:text-rose-400 flex-shrink-0" />
              <div>
                <div className="text-sm font-semibold dark:text-white text-stone-900">Reduce Animations</div>
                <div className="text-[11px] dark:text-slate-400 text-stone-500">Minimize movement for accessibility</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.reduceAnimations}
              onChange={() => toggle('reduceAnimations')}
              className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
            />
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between p-2.5 rounded-xl dark:bg-slate-900/60 bg-stone-50 border dark:border-slate-800 border-stone-200">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-sky-500 dark:text-sky-400 flex-shrink-0" />
              <div>
                <div className="text-sm font-semibold dark:text-white text-stone-900">Challenge Reminders</div>
                <div className="text-[11px] dark:text-slate-400 text-stone-500">Daily scripture alerts and tournament invitations</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.notificationsEnabled}
              onChange={() => toggle('notificationsEnabled')}
              className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-2 py-3 rounded-xl dark:bg-slate-900 bg-stone-100 hover:dark:bg-slate-850 hover:bg-stone-200 border dark:border-slate-800 border-stone-300 dark:text-slate-200 text-stone-800 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
        >
          Save & Close
        </button>
      </div>
    </div>
  );
};
