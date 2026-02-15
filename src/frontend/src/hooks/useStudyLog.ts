import { useState, useEffect, useCallback } from 'react';
import { useCustomizationSettings } from '../customization/useCustomizationSettings';
import { isInSleepWindow, shouldShowNotification } from '../customization/integration';
import { toast } from 'sonner';

export interface StudyLogEntry {
  id: string;
  timestamp: Date;
  hours: number;
}

const STORAGE_KEY = 'jee-study-log';

export function useStudyLog() {
  const { settings } = useCustomizationSettings();
  const [entries, setEntries] = useState<StudyLogEntry[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((e: any) => ({ ...e, timestamp: new Date(e.timestamp) }));
      }
    } catch (error) {
      console.error('Failed to load study log:', error);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Failed to save study log:', error);
    }
  }, [entries]);

  const logStudyTime = useCallback((hours: number, timestamp: Date = new Date()) => {
    const newEntry: StudyLogEntry = {
      id: `log-${Date.now()}`,
      timestamp,
      hours,
    };
    
    setEntries(prev => [...prev, newEntry]);
    
    // Check sleep window
    if (shouldShowNotification(settings) && isInSleepWindow(timestamp, settings)) {
      toast.error('Sleep Alert!', {
        description: `You logged study time during your sleep window (${settings.sleepWindowStart}–${settings.sleepWindowEnd}). Please prioritize rest!`,
        duration: 5000,
      });
    }
  }, [settings]);

  const getTodayHours = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return entries
      .filter(entry => {
        const entryDate = new Date(entry.timestamp);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === today.getTime();
      })
      .reduce((sum, entry) => sum + entry.hours, 0);
  }, [entries]);

  return {
    entries,
    logStudyTime,
    getTodayHours,
  };
}
