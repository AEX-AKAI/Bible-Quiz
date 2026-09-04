import React, { useState, useEffect } from 'react';
import { ChallengeConfig, ChallengeResult } from './data/models/ChallengeModels';
import { Question } from './data/models/Question';
import { UserProfile, AppSettings, DEFAULT_SETTINGS } from './data/models/UserProfile';
import { NetworkStatus } from './core/types';
import { QuestionRepository } from './data/repositories/QuestionRepository';
import { StorageService } from './platform/storage/StorageService';
import { WebAudioEngine } from './platform/audio/WebAudioEngine';
import { HapticService } from './platform/haptics/HapticService';
import { getPlatformService } from './platform/adapter';
import { OnlineChallengeService, LeaderboardEntry } from './data/api/OnlineChallengeService';
import { LobbyView } from './features/home/LobbyView';
import { QuizGameView } from './features/quiz/QuizGameView';
import { ResultsView } from './features/results/ResultsView';
import { LeaderboardView } from './features/leaderboard/LeaderboardView';
import { SettingsDialog } from './features/settings/SettingsDialog';
import { ProfileDialog } from './features/profile/ProfileDialog';

type AppView = 'LOBBY' | 'QUIZ' | 'RESULTS' | 'LEADERBOARD';

export const App: React.FC = () => {
  const [view, setView] = useState<AppView>('LOBBY');
  const [activeConfig, setActiveConfig] = useState<ChallengeConfig | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [lastResult, setLastResult] = useState<ChallengeResult | null>(null);
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);

  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>('ONLINE');

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const storage = StorageService.getInstance();
  const repo = QuestionRepository.getInstance();
  const audio = WebAudioEngine.getInstance();
  const haptics = HapticService.getInstance();
  const platform = getPlatformService();

  // Initialize App, Storage, Repository, and Platform listeners
  useEffect(() => {
    async function init() {
      await repo.initialize();
      const loadedSettings = await storage.getSettings();
      setSettings(loadedSettings);
      audio.updateSettings(loadedSettings);
      haptics.updateSettings(loadedSettings);

      const loadedProfile = await storage.getUserProfile();
      setUserProfile(loadedProfile);

      // Register network listener
      setNetworkStatus(platform.isOnline() ? 'ONLINE' : 'OFFLINE');
      const cleanupNetwork = platform.addNetworkListener((isOnline) => {
        setNetworkStatus(isOnline ? 'ONLINE' : 'OFFLINE');
      });

      return cleanupNetwork;
    }
    init();
  }, []);

  // Synchronize visual theme mode with root DOM element
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('theme-dark');
      document.documentElement.classList.remove('theme-light');
    } else {
      document.documentElement.classList.add('theme-light');
      document.documentElement.classList.remove('theme-dark');
    }
  }, [settings.darkMode]);

  // Update Settings handler
  const handleUpdateSettings = async (newSettings: AppSettings) => {
    setSettings(newSettings);
    audio.updateSettings(newSettings);
    haptics.updateSettings(newSettings);
    await storage.saveSettings(newSettings);
  };

  // Update Profile handler
  const handleUpdateProfile = async (updated: UserProfile) => {
    setUserProfile(updated);
    await storage.saveUserProfile(updated);
  };

  // Start Challenge flow
  const handleStartChallenge = async (config: ChallengeConfig) => {
    setActiveConfig(config);
    const questions = await repo.getQuestionsForChallenge(config);
    setActiveQuestions(questions);
    setView('QUIZ');
  };

  // On Challenge Complete
  const handleChallengeComplete = async (result: ChallengeResult) => {
    setLastResult(result);
    await storage.saveChallengeResult(result);
    if (userProfile) {
      const refreshed = await storage.getUserProfile();
      setUserProfile(refreshed);
    }
    setView('RESULTS');
  };

  // View Leaderboard
  const handleViewLeaderboard = (customConfig?: ChallengeConfig) => {
    const targetConfig = customConfig || activeConfig || {
      challengeId: 'GRACE24',
      seed: 'GRACE24',
      timeLimitSeconds: 180,
      difficulty: 'MIXED',
      isOnline: true,
      totalQuestions: 35,
    };
    setActiveConfig(targetConfig);
    const entries = OnlineChallengeService.getInstance().generateLobbyCompetitors(
      targetConfig,
      lastResult || undefined
    );
    setLeaderboardEntries(entries);
    setView('LEADERBOARD');
  };

  if (!userProfile) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-950 text-slate-400 font-sans">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3 animate-pulse text-xl">
            ✝
          </div>
          <p className="text-sm font-semibold">Initializing Bible Quiz Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col w-full h-full font-sans overflow-hidden transition-colors duration-200 ${
      settings.darkMode ? 'theme-dark bg-[#080D1A] text-slate-100' : 'theme-light bg-[#FAF7F0] text-stone-900'
    }`}>
      {view === 'LOBBY' && (
        <LobbyView
          userProfile={userProfile}
          settings={settings}
          networkStatus={networkStatus}
          onStartChallenge={handleStartChallenge}
          onViewLeaderboard={(config) => handleViewLeaderboard(config)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
        />
      )}

      {view === 'QUIZ' && activeConfig && (
        <QuizGameView
          config={activeConfig}
          questions={activeQuestions}
          playerName={userProfile.displayName}
          onComplete={handleChallengeComplete}
          onExit={() => setView('LOBBY')}
          reduceAnimations={settings.reduceAnimations}
        />
      )}

      {view === 'RESULTS' && lastResult && (
        <ResultsView
          result={lastResult}
          onPlayAgain={() => {
            if (activeConfig) {
              handleStartChallenge({
                ...activeConfig,
                challengeId: Math.random().toString(36).substring(2, 8).toUpperCase(),
              });
            }
          }}
          onViewLeaderboard={() => handleViewLeaderboard()}
          onHome={() => setView('LOBBY')}
        />
      )}

      {view === 'LEADERBOARD' && activeConfig && (
        <LeaderboardView
          entries={leaderboardEntries}
          challengeId={activeConfig.challengeId}
          onBack={() => setView(lastResult ? 'RESULTS' : 'LOBBY')}
        />
      )}

      {/* Settings Modal */}
      <SettingsDialog
        settings={settings}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onUpdate={handleUpdateSettings}
      />

      {/* Profile Modal */}
      <ProfileDialog
        profile={userProfile}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onSave={handleUpdateProfile}
      />
    </div>
  );
};
export default App;
