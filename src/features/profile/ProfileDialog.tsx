import React, { useState } from 'react';
import { UserProfile } from '../../data/models/UserProfile';
import { User, Trophy, Flame, Zap, Target, BookOpen, X, Check } from 'lucide-react';

interface Props {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: UserProfile) => void;
}

export const ProfileDialog: React.FC<Props> = ({
  profile,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(profile.displayName);
  const [favoriteBook, setFavoriteBook] = useState(profile.favoriteBook);

  const handleSave = () => {
    onSave({
      ...profile,
      displayName: name.trim() || 'FaithSeeker',
      favoriteBook: favoriteBook.trim() || 'Psalms',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 font-bold text-base text-white">
            <User size={18} className="text-amber-400" />
            <span>Player Profile</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Profile Content */}
        <div className="space-y-4 py-4 overflow-y-auto">
          {/* Display Name Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              maxLength={24}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Favorite Book */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Favorite Scripture Book
            </label>
            <input
              type="text"
              value={favoriteBook}
              maxLength={20}
              onChange={(e) => setFavoriteBook(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Career Stats Grid */}
          <div className="pt-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Cross-Platform Career Records
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-750">
                <div className="flex items-center gap-1.5 text-xs text-amber-400 mb-0.5">
                  <Trophy size={14} />
                  <span>Highest Score</span>
                </div>
                <div className="text-lg font-bold">{profile.highestScore.toFixed(1)}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-750">
                <div className="flex items-center gap-1.5 text-xs text-amber-500 mb-0.5">
                  <Flame size={14} />
                  <span>Best Streak</span>
                </div>
                <div className="text-lg font-bold">{profile.bestComboRecord}x</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-750">
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 mb-0.5">
                  <Target size={14} />
                  <span>Questions Solved</span>
                </div>
                <div className="text-lg font-bold">{profile.totalCorrectAnswers}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-750">
                <div className="flex items-center gap-1.5 text-xs text-yellow-400 mb-0.5">
                  <Zap size={14} />
                  <span>Speed Bonuses</span>
                </div>
                <div className="text-lg font-bold">{profile.totalSpeedBonuses}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSave}
          className="w-full mt-2 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20"
        >
          <Check size={16} />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
};
