import React, { useState, useEffect } from 'react';
import { App as CapApp } from '@capacitor/app';
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
import { ReviewScriptureView } from './features/results/ReviewScriptureView';
import { LeaderboardView } from './features/leaderboard/LeaderboardView';
import { SettingsDialog } from './features/settings/SettingsDialog';
import { ProfileDialog } from './features/profile/ProfileDialog';

type AppView = 'LOBBY' | 'QUIZ' | 'RESULTS' | 'LEADERBOARD' | 'REVIEW';

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

  // Navigate helper with browser history support
  const navigateToView = (newView: AppView) => {
    setView(newView);
    try {
      const hash = newView === 'LOBBY' ? '' : `#${newView.toLowerCase()}`;
      if (window.location.hash !== hash) {
        window.history.pushState({ view: newView }, '', hash || window.location.pathname);
      }
    } catch {
      // Ignored in non-browser environments
    }
  };

  // Browser popstate listener for back/forward buttons
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      const stateView = e.state?.view as AppView | undefined;
      const hash = window.location.hash.toLowerCase();

      if (stateView === 'REVIEW' || hash === '#review') {
        if (lastResult) setView('REVIEW');
        else setView('LOBBY');
      } else if (stateView === 'RESULTS' || hash === '#results') {
        if (lastResult) setView('RESULTS');
        else setView('LOBBY');
      } else if (stateView === 'LEADERBOARD' || hash === '#leaderboard') {
        setView('LEADERBOARD');
      } else if (stateView === 'QUIZ' || hash === '#quiz') {
        if (activeConfig) setView('QUIZ');
        else setView('LOBBY');
      } else {
        setView('LOBBY');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [lastResult, activeConfig]);

  // Start Challenge flow
  const handleStartChallenge = async (config: ChallengeConfig) => {
    setActiveConfig(config);
    const questions = await repo.getQuestionsForChallenge(config);
    setActiveQuestions(questions);
    navigateToView('QUIZ');
  };

  // On Challenge Complete
  const handleChallengeComplete = async (result: ChallengeResult) => {
    setLastResult(result);
    await storage.saveChallengeResult(result);
    if (userProfile) {
      const refreshed = await storage.getUserProfile();
      setUserProfile(refreshed);
    }
    navigateToView('RESULTS');
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
    navigateToView('LEADERBOARD');
  };

  // Native Android hardware/gesture back button handling via Capacitor
  useEffect(() => {
    let removeListener: (() => void) | null = null;

    const setupListener = async () => {
      try {
        const handle = await CapApp.addListener('backButton', () => {
          if (isSettingsOpen) {
            setIsSettingsOpen(false);
          } else if (isProfileOpen) {
            setIsProfileOpen(false);
          } else if (view === 'REVIEW') {
            navigateToView('RESULTS');
          } else if (view === 'QUIZ') {
            navigateToView('LOBBY');
          } else if (view === 'RESULTS' || view === 'LEADERBOARD') {
            navigateToView('LOBBY');
          } else {
            CapApp.exitApp();
          }
        });
        removeListener = () => handle.remove();
      } catch {
        // Web browser environment, ignored
      }
    };

    setupListener();

    return () => {
      if (removeListener) removeListener();
    };
  }, [view, isSettingsOpen, isProfileOpen]);

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
          onHome={() => navigateToView('LOBBY')}
          onReviewScripture={() => navigateToView('REVIEW')}
        />
      )}

      {view === 'REVIEW' && lastResult && (
        <ReviewScriptureView
          result={lastResult}
          onBack={() => navigateToView('RESULTS')}
          onPlayAgain={() => {
            if (activeConfig) {
              handleStartChallenge({
                ...activeConfig,
                challengeId: Math.random().toString(36).substring(2, 8).toUpperCase(),
              });
            }
          }}
        />
      )}

      {view === 'LEADERBOARD' && activeConfig && (
        <LeaderboardView
          entries={leaderboardEntries}
          challengeId={activeConfig.challengeId}
          onBack={() => navigateToView(lastResult ? 'RESULTS' : 'LOBBY')}
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
