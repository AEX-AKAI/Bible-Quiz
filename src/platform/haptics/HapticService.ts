import { getPlatformService } from '../adapter';
import { AppSettings } from '../../data/models/UserProfile';

export class HapticService {
  private static instance: HapticService;
  private isEnabled: boolean = true;

  private constructor() {}

  public static getInstance(): HapticService {
    if (!HapticService.instance) {
      HapticService.instance = new HapticService();
    }
    return HapticService.instance;
  }

  public updateSettings(settings: AppSettings) {
    this.isEnabled = settings.hapticFeedbackEnabled;
  }

  public lightTap() {
    if (!this.isEnabled) return;
    getPlatformService().vibrateImpact('light');
  }

  public mediumTap() {
    if (!this.isEnabled) return;
    getPlatformService().vibrateImpact('medium');
  }

  public success() {
    if (!this.isEnabled) return;
    getPlatformService().vibrateNotification('success');
  }

  public comboMilestone() {
    if (!this.isEnabled) return;
    getPlatformService().vibrateImpact('medium');
    setTimeout(() => {
      if (this.isEnabled) {
        getPlatformService().vibrateImpact('light');
      }
    }, 100);
  }

  public warning() {
    if (!this.isEnabled) return;
    getPlatformService().vibrateNotification('warning');
  }

  public error() {
    if (!this.isEnabled) return;
    getPlatformService().vibrateNotification('error');
  }
}
