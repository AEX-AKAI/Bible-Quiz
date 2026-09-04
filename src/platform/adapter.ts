import { PlatformType } from '../core/types';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

export interface PlatformService {
  getPlatform(): PlatformType;
  vibrate(pattern: number | number[]): void;
  vibrateImpact(style?: 'light' | 'medium' | 'heavy'): void;
  vibrateNotification(type?: 'success' | 'warning' | 'error'): void;
  showNotification(title: string, message: string): void;
  saveData(key: string, value: unknown): Promise<void>;
  loadData<T>(key: string): Promise<T | null>;
  isOnline(): boolean;
  addNetworkListener(callback: (online: boolean) => void): () => void;
}

export abstract class BasePlatformService implements PlatformService {
  abstract getPlatform(): PlatformType;

  public vibrate(pattern: number | number[]): void {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignore fallback
      }
    }
  }

  public vibrateImpact(style: 'light' | 'medium' | 'heavy' = 'light'): void {
    if (Capacitor.isPluginAvailable('Haptics')) {
      const capStyle = 
        style === 'heavy' ? ImpactStyle.Heavy :
        style === 'medium' ? ImpactStyle.Medium : ImpactStyle.Light;
      Haptics.impact({ style: capStyle }).catch(() => {});
    } else {
      this.vibrate(style === 'heavy' ? 40 : style === 'medium' ? 25 : 15);
    }
  }

  public vibrateNotification(type: 'success' | 'warning' | 'error' = 'success'): void {
    if (Capacitor.isPluginAvailable('Haptics')) {
      const capType = 
        type === 'error' ? NotificationType.Error :
        type === 'warning' ? NotificationType.Warning : NotificationType.Success;
      Haptics.notification({ type: capType }).catch(() => {});
    } else {
      this.vibrate(type === 'error' ? [50, 50, 50] : [20, 30, 20]);
    }
  }

  public showNotification(title: string, message: string): void {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      try {
        new Notification(title, { body: message, icon: '/icons/icon-192.svg' });
      } catch {
        // Silently handle
      }
    }
  }

  public async saveData(key: string, value: unknown): Promise<void> {
    try {
      localStorage.setItem(`bq_${key}`, JSON.stringify(value));
    } catch (err) {
      console.warn('Storage save warning:', err);
    }
  }

  public async loadData<T>(key: string): Promise<T | null> {
    try {
      const item = localStorage.getItem(`bq_${key}`);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }

  public isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  public addNetworkListener(callback: (online: boolean) => void): () => void {
    const handleOnline = () => callback(true);
    const handleOffline = () => callback(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }
}

export class WebPlatformService extends BasePlatformService {
  getPlatform(): PlatformType {
    return 'web';
  }
}

export class AndroidPlatformService extends BasePlatformService {
  getPlatform(): PlatformType {
    return 'android';
  }
}

export class IOSPlatformService extends BasePlatformService {
  getPlatform(): PlatformType {
    return 'ios';
  }
}

export class DesktopPlatformService extends BasePlatformService {
  private osType: PlatformType;

  constructor(os: PlatformType = 'windows') {
    super();
    this.osType = os;
  }

  getPlatform(): PlatformType {
    return this.osType;
  }

  // Desktop bypasses vibration gracefully without errors
  public override vibrate(): void {}
  public override vibrateImpact(): void {}
  public override vibrateNotification(): void {}
}

let activePlatformService: PlatformService | null = null;

export function getPlatformService(): PlatformService {
  if (activePlatformService) return activePlatformService;

  // 1. Check Electron Desktop Wrapper
  if (typeof window !== 'undefined' && (window as any).desktopAPI) {
    const os = (window as any).desktopAPI.platform;
    const platform: PlatformType = 
      os === 'darwin' ? 'macos' : 
      os === 'linux' ? 'linux' : 'windows';
    activePlatformService = new DesktopPlatformService(platform);
    return activePlatformService;
  }

  // 2. Check Capacitor Native Platform
  const capPlatform = Capacitor.getPlatform();
  if (capPlatform === 'android') {
    activePlatformService = new AndroidPlatformService();
    return activePlatformService;
  }
  if (capPlatform === 'ios') {
    activePlatformService = new IOSPlatformService();
    return activePlatformService;
  }

  // 3. Fallback to Web/PWA
  activePlatformService = new WebPlatformService();
  return activePlatformService;
}
