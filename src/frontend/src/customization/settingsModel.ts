export interface CustomizationSettings {
  dailyTargetHours: number;
  lectureSpeedFactor: number;
  sleepWindowStart: string;
  sleepWindowEnd: string;
  notificationsEnabled: boolean;
  chapterCardSize: 'compact' | 'detailed';
  autoRecalculateDateToFinish: boolean;
  darkModeOverride: {
    enabled: boolean;
    mode: 'light' | 'dark';
  };
}

export const DEFAULT_SETTINGS: CustomizationSettings = {
  dailyTargetHours: 7,
  lectureSpeedFactor: 1.5,
  sleepWindowStart: '03:30',
  sleepWindowEnd: '07:30',
  notificationsEnabled: true,
  chapterCardSize: 'detailed',
  autoRecalculateDateToFinish: true,
  darkModeOverride: {
    enabled: false,
    mode: 'dark',
  },
};

export function validateSettings(settings: Partial<CustomizationSettings>): CustomizationSettings {
  return {
    dailyTargetHours: Math.max(1, Math.min(16, settings.dailyTargetHours ?? DEFAULT_SETTINGS.dailyTargetHours)),
    lectureSpeedFactor: Math.max(1, Math.min(2, settings.lectureSpeedFactor ?? DEFAULT_SETTINGS.lectureSpeedFactor)),
    sleepWindowStart: settings.sleepWindowStart ?? DEFAULT_SETTINGS.sleepWindowStart,
    sleepWindowEnd: settings.sleepWindowEnd ?? DEFAULT_SETTINGS.sleepWindowEnd,
    notificationsEnabled: settings.notificationsEnabled ?? DEFAULT_SETTINGS.notificationsEnabled,
    chapterCardSize: settings.chapterCardSize ?? DEFAULT_SETTINGS.chapterCardSize,
    autoRecalculateDateToFinish: settings.autoRecalculateDateToFinish ?? DEFAULT_SETTINGS.autoRecalculateDateToFinish,
    darkModeOverride: settings.darkModeOverride ?? DEFAULT_SETTINGS.darkModeOverride,
  };
}
