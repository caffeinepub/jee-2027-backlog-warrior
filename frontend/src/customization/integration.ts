import { type CustomizationSettings } from './settingsModel';

export function shouldShowNotification(settings: CustomizationSettings): boolean {
  return settings.notificationsEnabled;
}

export function isInSleepWindow(timestamp: Date, settings: CustomizationSettings): boolean {
  const hours = timestamp.getHours();
  const minutes = timestamp.getMinutes();
  const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  
  const [startHour, startMin] = settings.sleepWindowStart.split(':').map(Number);
  const [endHour, endMin] = settings.sleepWindowEnd.split(':').map(Number);
  
  const currentMinutes = hours * 60 + minutes;
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  if (startMinutes <= endMinutes) {
    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  } else {
    // Sleep window crosses midnight
    return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
  }
}

export function getChapterCardDensity(settings: CustomizationSettings): 'compact' | 'detailed' {
  return settings.chapterCardSize;
}

export function calculateTargetHours(
  totalLectures: number,
  lectureDuration: number,
  settings: CustomizationSettings
): number {
  return (totalLectures * lectureDuration) / (settings.lectureSpeedFactor * 60);
}

export function calculateDateToFinish(
  targetHours: number,
  settings: CustomizationSettings
): Date | null {
  if (!settings.autoRecalculateDateToFinish) return null;
  
  const today = new Date();
  const daysNeeded = Math.ceil(targetHours / settings.dailyTargetHours);
  const finishDate = new Date(today);
  finishDate.setDate(finishDate.getDate() + daysNeeded);
  
  return finishDate;
}
