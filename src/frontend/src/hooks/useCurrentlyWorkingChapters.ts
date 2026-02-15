import { useState, useEffect, useCallback } from 'react';
import { APP_STORAGE_KEYS } from '../lib/appLocalStorage';

interface WorkingEntry {
  id: string;
  duration: number;
  timestamp: number;
}

interface WorkingChapterState {
  chapterId: string;
  startTime: number;
  pausedAt?: number;
  accumulatedTime: number;
  entries: WorkingEntry[];
}

interface WorkingChaptersData {
  version: number;
  chapters: Record<string, WorkingChapterState>;
}

interface ActiveChapter {
  chapterId: string;
  isPaused: boolean;
  elapsedTime: number;
}

const STORAGE_KEY = APP_STORAGE_KEYS.WORKING_CHAPTERS;
const CURRENT_VERSION = 2;

function loadWorkingChapters(): Record<string, WorkingChapterState> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};

    const parsed = JSON.parse(stored) as WorkingChaptersData;

    // Migration from v1 to v2
    if (parsed.version === 1) {
      const migratedChapters: Record<string, WorkingChapterState> = {};
      for (const [id, state] of Object.entries(parsed.chapters)) {
        migratedChapters[id] = {
          ...state,
          entries: state.entries || [],
        };
      }
      return migratedChapters;
    }

    return parsed.chapters || {};
  } catch (error) {
    console.error('Failed to load working chapters:', error);
    return {};
  }
}

function saveWorkingChapters(chapters: Record<string, WorkingChapterState>) {
  try {
    const data: WorkingChaptersData = {
      version: CURRENT_VERSION,
      chapters,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    console.error('Failed to save working chapters:', error);
  }
}

export function useCurrentlyWorkingChapters() {
  const [workingChapters, setWorkingChapters] = useState<Record<string, WorkingChapterState>>(loadWorkingChapters);
  const [, setTick] = useState(0);

  // Live update every second for active timers
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync across tabs
  useEffect(() => {
    const handleStorageChange = () => {
      setWorkingChapters(loadWorkingChapters());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const isWorking = useCallback((chapterId: string): boolean => {
    return !!workingChapters[chapterId] && !workingChapters[chapterId].pausedAt;
  }, [workingChapters]);

  const isPaused = useCallback((chapterId: string): boolean => {
    return !!workingChapters[chapterId] && !!workingChapters[chapterId].pausedAt;
  }, [workingChapters]);

  const getElapsedTime = useCallback((chapterId: string): number => {
    const state = workingChapters[chapterId];
    if (!state) return 0;

    const now = Date.now();
    let elapsed = state.accumulatedTime;

    if (state.pausedAt) {
      // Paused: use accumulated time only
      elapsed = state.accumulatedTime;
    } else {
      // Running: add current session time
      elapsed = state.accumulatedTime + Math.floor((now - state.startTime) / 1000);
    }

    return elapsed;
  }, [workingChapters]);

  const getActiveChapters = useCallback((): ActiveChapter[] => {
    const active: ActiveChapter[] = [];
    
    for (const [chapterId, state] of Object.entries(workingChapters)) {
      // Only include chapters that have an active or paused session
      if (state.startTime > 0 || state.pausedAt) {
        const now = Date.now();
        let elapsedTime = state.accumulatedTime;
        
        if (!state.pausedAt) {
          elapsedTime += Math.floor((now - state.startTime) / 1000);
        }
        
        active.push({
          chapterId,
          isPaused: !!state.pausedAt,
          elapsedTime,
        });
      }
    }
    
    return active;
  }, [workingChapters]);

  const startWorking = useCallback((chapterId: string) => {
    setWorkingChapters(prev => {
      const updated = {
        ...prev,
        [chapterId]: {
          chapterId,
          startTime: Date.now(),
          accumulatedTime: 0,
          entries: prev[chapterId]?.entries || [],
        },
      };
      saveWorkingChapters(updated);
      return updated;
    });
  }, []);

  const pauseWorking = useCallback((chapterId: string) => {
    setWorkingChapters(prev => {
      const state = prev[chapterId];
      if (!state || state.pausedAt) return prev;

      const now = Date.now();
      const sessionTime = Math.floor((now - state.startTime) / 1000);
      
      const updated = {
        ...prev,
        [chapterId]: {
          ...state,
          pausedAt: now,
          accumulatedTime: state.accumulatedTime + sessionTime,
        },
      };
      saveWorkingChapters(updated);
      return updated;
    });
  }, []);

  const resumeWorking = useCallback((chapterId: string) => {
    setWorkingChapters(prev => {
      const state = prev[chapterId];
      if (!state || !state.pausedAt) return prev;

      const updated = {
        ...prev,
        [chapterId]: {
          ...state,
          startTime: Date.now(),
          pausedAt: undefined,
        },
      };
      saveWorkingChapters(updated);
      return updated;
    });
  }, []);

  const stopWorking = useCallback((chapterId: string) => {
    setWorkingChapters(prev => {
      const state = prev[chapterId];
      if (!state) return prev;

      const now = Date.now();
      let totalTime = state.accumulatedTime;
      
      if (!state.pausedAt) {
        // If not paused, add current session time
        totalTime += Math.floor((now - state.startTime) / 1000);
      }

      // Create a new entry with the total time
      const newEntry: WorkingEntry = {
        id: `entry-${Date.now()}`,
        duration: totalTime,
        timestamp: now,
      };

      const updated = { ...prev };
      delete updated[chapterId];
      
      // Keep entries but remove active state
      if (totalTime > 0) {
        updated[chapterId] = {
          chapterId,
          startTime: 0,
          accumulatedTime: 0,
          entries: [...(state.entries || []), newEntry],
        };
      }

      saveWorkingChapters(updated);
      return updated;
    });
  }, []);

  const getWorkingEntries = useCallback((chapterId: string): WorkingEntry[] => {
    return workingChapters[chapterId]?.entries || [];
  }, [workingChapters]);

  const addWorkingEntry = useCallback((chapterId: string, duration: number) => {
    setWorkingChapters(prev => {
      const state = prev[chapterId] || {
        chapterId,
        startTime: 0,
        accumulatedTime: 0,
        entries: [],
      };

      const newEntry: WorkingEntry = {
        id: `entry-${Date.now()}`,
        duration,
        timestamp: Date.now(),
      };

      const updated = {
        ...prev,
        [chapterId]: {
          ...state,
          entries: [...state.entries, newEntry],
        },
      };
      saveWorkingChapters(updated);
      return updated;
    });
  }, []);

  const updateWorkingEntry = useCallback((chapterId: string, entryId: string, duration: number) => {
    setWorkingChapters(prev => {
      const state = prev[chapterId];
      if (!state) return prev;

      const updated = {
        ...prev,
        [chapterId]: {
          ...state,
          entries: state.entries.map(entry =>
            entry.id === entryId ? { ...entry, duration } : entry
          ),
        },
      };
      saveWorkingChapters(updated);
      return updated;
    });
  }, []);

  const deleteWorkingEntry = useCallback((chapterId: string, entryId: string) => {
    setWorkingChapters(prev => {
      const state = prev[chapterId];
      if (!state) return prev;

      const updated = {
        ...prev,
        [chapterId]: {
          ...state,
          entries: state.entries.filter(entry => entry.id !== entryId),
        },
      };
      saveWorkingChapters(updated);
      return updated;
    });
  }, []);

  return {
    isWorking,
    isPaused,
    getElapsedTime,
    getActiveChapters,
    startWorking,
    pauseWorking,
    resumeWorking,
    stopWorking,
    getWorkingEntries,
    addWorkingEntry,
    updateWorkingEntry,
    deleteWorkingEntry,
  };
}
