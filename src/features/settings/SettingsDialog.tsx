import React from 'react';
import { AppSettings } from '../../data/models/UserProfile';
import { Volume2, VolumeX, Music, Bell, Sparkles, Shield, X, Sliders } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 font-bold text-base text-white">
            <Sliders size={18} className="text-amber-400" />
            <span>Game Settings</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Settings List */}
        <div className="space-y-4 py-4 overflow-y-auto pr-1">
          {/* Audio Master Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.masterAudioEnabled ? (
                <Volume2 size={20} className="text-amber-400" />
              ) : (
                <VolumeX size={20} className="text-slate-500" />
              )}
              <div>
                <div className="text-sm font-semibold">Master Audio</div>
                <div className="text-[11px] text-slate-400">Enable overall sound engine</div>
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
            <div className="pl-8 pr-2">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Master Volume</span>
                <span>{Math.round(settings.masterVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.masterVolume}
                onChange={(e) => handleSlider('masterVolume', parseFloat(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
          )}

          {/* Ambient Music */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Music size={20} className="text-indigo-400" />
              <div>
                <div className="text-sm font-semibold">Peaceful Ambient Audio</div>
                <div className="text-[11px] text-slate-400">Calm celestial background pad</div>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles size={20} className="text-yellow-400" />
              <div>
                <div className="text-sm font-semibold">Sound Effects (SFX)</div>
                <div className="text-[11px] text-slate-400">Chimes, streaks, speed bonus</div>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-emerald-400" />
              <div>
                <div className="text-sm font-semibold">Haptic Feedback</div>
                <div className="text-[11px] text-slate-400">Vibrate on tap and answers</div>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles size={20} className="text-rose-400" />
              <div>
                <div className="text-sm font-semibold">Reduce Animations</div>
                <div className="text-[11px] text-slate-400">Minimize movement for accessibility</div>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-sky-400" />
              <div>
                <div className="text-sm font-semibold">Notifications</div>
                <div className="text-[11px] text-slate-400">Challenge alerts and daily verses</div>
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
          className="w-full mt-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
        >
          Save & Close
        </button>
      </div>
    </div>
  );
};
