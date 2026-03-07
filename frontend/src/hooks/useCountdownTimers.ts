import { useState, useEffect } from 'react';

export interface CountdownTimer {
  id: string;
  label: string;
  targetDate: string;
}

const STORAGE_KEY_TIMERS = 'countdown-timers-list';
const STORAGE_KEY_SELECTED = 'countdown-selected-timer-id';
const LEGACY_STORAGE_KEY = 'countdown-target-date';
const STORAGE_VERSION = 1;

interface StorageData {
  version: number;
  timers: CountdownTimer[];
}

export function useCountdownTimers() {
  const [timers, setTimers] = useState<CountdownTimer[]>([]);
  const [selectedTimerId, setSelectedTimerId] = useState<string | null>(null);

  // Load from localStorage on mount with migration and hardened error handling
  useEffect(() => {
    try {
      const storedTimers = localStorage.getItem(STORAGE_KEY_TIMERS);
      const storedSelected = localStorage.getItem(STORAGE_KEY_SELECTED);

      if (storedTimers) {
        // Load existing multi-timer data
        try {
          const data: StorageData = JSON.parse(storedTimers);
          
          // Validate schema
          if (
            typeof data === 'object' &&
            data !== null &&
            typeof data.version === 'number' &&
            Array.isArray(data.timers)
          ) {
            // Validate each timer has required fields
            const validTimers = data.timers.filter(
              (t) =>
                typeof t === 'object' &&
                t !== null &&
                typeof t.id === 'string' &&
                typeof t.label === 'string' &&
                typeof t.targetDate === 'string'
            );

            if (validTimers.length > 0) {
              setTimers(validTimers);
              
              // Reconcile selected timer
              if (storedSelected && validTimers.some((t) => t.id === storedSelected)) {
                setSelectedTimerId(storedSelected);
              } else {
                // Selected timer doesn't exist, select first available
                setSelectedTimerId(validTimers[0].id);
                localStorage.setItem(STORAGE_KEY_SELECTED, validTimers[0].id);
              }
            } else {
              // No valid timers, reset to safe state
              console.warn('No valid timers found in storage, resetting to empty state');
              resetToSafeState();
            }
          } else {
            // Invalid schema
            console.error('Invalid countdown timers storage schema, resetting to safe state');
            resetToSafeState();
          }
        } catch (parseError) {
          console.error('Failed to parse countdown timers storage:', parseError);
          resetToSafeState();
        }
      } else {
        // Migration: check for legacy single timer
        const legacyDate = localStorage.getItem(LEGACY_STORAGE_KEY);
        if (legacyDate) {
          const date = new Date(legacyDate);
          if (!isNaN(date.getTime())) {
            // Create a default timer from legacy data
            const migratedTimer: CountdownTimer = {
              id: generateId(),
              label: 'My Timer',
              targetDate: legacyDate,
            };
            setTimers([migratedTimer]);
            setSelectedTimerId(migratedTimer.id);
            // Save migrated data
            saveTimers([migratedTimer]);
            localStorage.setItem(STORAGE_KEY_SELECTED, migratedTimer.id);
            // Clean up legacy key
            localStorage.removeItem(LEGACY_STORAGE_KEY);
          } else {
            // Invalid legacy date, clear it
            localStorage.removeItem(LEGACY_STORAGE_KEY);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load countdown timers:', error);
      resetToSafeState();
    }
  }, []);

  const resetToSafeState = () => {
    setTimers([]);
    setSelectedTimerId(null);
    try {
      localStorage.removeItem(STORAGE_KEY_TIMERS);
      localStorage.removeItem(STORAGE_KEY_SELECTED);
    } catch (e) {
      console.error('Failed to clear storage:', e);
    }
  };

  const saveTimers = (newTimers: CountdownTimer[]) => {
    try {
      const data: StorageData = {
        version: STORAGE_VERSION,
        timers: newTimers,
      };
      localStorage.setItem(STORAGE_KEY_TIMERS, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save countdown timers:', error);
    }
  };

  const createTimer = (label: string, targetDate?: string) => {
    const trimmedLabel = label.trim();
    if (!trimmedLabel) {
      console.warn('Cannot create timer with empty label');
      return null;
    }

    const newTimer: CountdownTimer = {
      id: generateId(),
      label: trimmedLabel,
      targetDate: targetDate || new Date().toISOString(),
    };
    const updatedTimers = [...timers, newTimer];
    setTimers(updatedTimers);
    setSelectedTimerId(newTimer.id);
    saveTimers(updatedTimers);
    localStorage.setItem(STORAGE_KEY_SELECTED, newTimer.id);
    return newTimer;
  };

  const selectTimer = (timerId: string) => {
    if (timers.some((t) => t.id === timerId)) {
      setSelectedTimerId(timerId);
      localStorage.setItem(STORAGE_KEY_SELECTED, timerId);
    }
  };

  const updateTimerTargetDate = (timerId: string, targetDate: string) => {
    const dateObj = new Date(targetDate);
    if (isNaN(dateObj.getTime())) {
      return; // Invalid date
    }
    const updatedTimers = timers.map((timer) =>
      timer.id === timerId ? { ...timer, targetDate } : timer
    );
    setTimers(updatedTimers);
    saveTimers(updatedTimers);
  };

  const renameTimer = (timerId: string, newLabel: string) => {
    const trimmedLabel = newLabel.trim();
    if (!trimmedLabel) {
      console.warn('Cannot rename timer to empty label');
      return false;
    }

    const updatedTimers = timers.map((timer) =>
      timer.id === timerId ? { ...timer, label: trimmedLabel } : timer
    );
    setTimers(updatedTimers);
    saveTimers(updatedTimers);
    return true;
  };

  const deleteTimer = (timerId: string) => {
    const updatedTimers = timers.filter((t) => t.id !== timerId);
    setTimers(updatedTimers);
    saveTimers(updatedTimers);

    // If deleted timer was selected, select another or clear selection
    if (selectedTimerId === timerId) {
      if (updatedTimers.length > 0) {
        const newSelectedId = updatedTimers[0].id;
        setSelectedTimerId(newSelectedId);
        localStorage.setItem(STORAGE_KEY_SELECTED, newSelectedId);
      } else {
        setSelectedTimerId(null);
        localStorage.removeItem(STORAGE_KEY_SELECTED);
      }
    }
  };

  const selectedTimer = timers.find((t) => t.id === selectedTimerId) || null;

  return {
    timers,
    selectedTimer,
    selectedTimerId,
    createTimer,
    selectTimer,
    updateTimerTargetDate,
    renameTimer,
    deleteTimer,
  };
}

function generateId(): string {
  return `timer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
