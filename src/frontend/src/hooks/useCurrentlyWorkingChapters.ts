import { useState, useEffect, useCallback } from 'react';

interface WorkingEntry {
  id: string;
  duration: number; // in seconds
  timestamp: number; // when it was recorded
}

interface CurrentlyWorkingChapter {
  chapterId: string;
  startTime: number; // timestamp in milliseconds
  isPaused: boolean;
  pausedAt?: number; // timestamp when paused
  accumulatedTime: number; // accumulated seconds before current session
  workingEntries: WorkingEntry[]; // recorded working time entries
}

interface CurrentlyWorkingState {
  chapters: CurrentlyWorkingChapter[];
  version: number;
}

const STORAGE_KEY = 'currently-working-chapters';
const STORAGE_VERSION = 2;

function loadState(): CurrentlyWorkingState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { chapters: [], version: STORAGE_VERSION };
    }
    const parsed = JSON.parse(stored);
    
    // Backward compatibility: migrate from version 1 to version 2
    if (parsed.version === 1) {
      const migratedChapters = parsed.chapters.map((ch: any) => ({
        chapterId: ch.chapterId,
        startTime: ch.startTime,
        isPaused: false,
        accumulatedTime: 0,
        workingEntries: [],
      }));
      return { chapters: migratedChapters, version: STORAGE_VERSION };
    }
    
    if (parsed.version !== STORAGE_VERSION) {
      return { chapters: [], version: STORAGE_VERSION };
    }
    return parsed;
  } catch {
    return { chapters: [], version: STORAGE_VERSION };
  }
}

function saveState(state: CurrentlyWorkingState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save currently working state:', error);
  }
}

export function useCurrentlyWorkingChapters() {
  const [state, setState] = useState<CurrentlyWorkingState>(loadState);
  const [now, setNow] = useState(Date.now());

  // Update 'now' every second for live elapsed time
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Persist state changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  const startWorking = useCallback((chapterId: string) => {
    setState(prev => {
      const existing = prev.chapters.find(ch => ch.chapterId === chapterId);
      if (existing) {
        // If paused, resume
        if (existing.isPaused && existing.pausedAt) {
          return {
            ...prev,
            chapters: prev.chapters.map(ch =>
              ch.chapterId === chapterId
                ? { ...ch, isPaused: false, startTime: Date.now(), pausedAt: undefined }
                : ch
            ),
          };
        }
        return prev; // Already working on it
      }
      return {
        ...prev,
        chapters: [
          ...prev.chapters,
          {
            chapterId,
            startTime: Date.now(),
            isPaused: false,
            accumulatedTime: 0,
            workingEntries: [],
          },
        ],
      };
    });
  }, []);

  const pauseWorking = useCallback((chapterId: string) => {
    setState(prev => {
      const chapter = prev.chapters.find(ch => ch.chapterId === chapterId);
      if (!chapter || chapter.isPaused) return prev;

      const elapsed = Math.floor((Date.now() - chapter.startTime) / 1000);
      return {
        ...prev,
        chapters: prev.chapters.map(ch =>
          ch.chapterId === chapterId
            ? {
                ...ch,
                isPaused: true,
                pausedAt: Date.now(),
                accumulatedTime: ch.accumulatedTime + elapsed,
              }
            : ch
        ),
      };
    });
  }, []);

  const stopWorking = useCallback((chapterId: string) => {
    setState(prev => ({
      ...prev,
      chapters: prev.chapters.filter(ch => ch.chapterId !== chapterId),
    }));
  }, []);

  const isWorking = useCallback((chapterId: string) => {
    return state.chapters.some(ch => ch.chapterId === chapterId);
  }, [state.chapters]);

  const isPaused = useCallback((chapterId: string) => {
    const chapter = state.chapters.find(ch => ch.chapterId === chapterId);
    return chapter?.isPaused || false;
  }, [state.chapters]);

  const getElapsedTime = useCallback((chapterId: string): number => {
    const chapter = state.chapters.find(ch => ch.chapterId === chapterId);
    if (!chapter) return 0;
    
    if (chapter.isPaused) {
      return chapter.accumulatedTime;
    }
    
    const currentSessionTime = Math.floor((now - chapter.startTime) / 1000);
    return chapter.accumulatedTime + currentSessionTime;
  }, [state.chapters, now]);

  const getActiveChapters = useCallback(() => {
    return state.chapters.map(ch => {
      let elapsedSeconds = ch.accumulatedTime;
      if (!ch.isPaused) {
        elapsedSeconds += Math.floor((now - ch.startTime) / 1000);
      }
      return {
        chapterId: ch.chapterId,
        elapsedSeconds,
        isPaused: ch.isPaused,
      };
    });
  }, [state.chapters, now]);

  const addWorkingEntry = useCallback((chapterId: string, durationSeconds: number) => {
    setState(prev => ({
      ...prev,
      chapters: prev.chapters.map(ch =>
        ch.chapterId === chapterId
          ? {
              ...ch,
              workingEntries: [
                ...ch.workingEntries,
                {
                  id: `entry-${Date.now()}-${Math.random()}`,
                  duration: durationSeconds,
                  timestamp: Date.now(),
                },
              ],
            }
          : ch
      ),
    }));
  }, []);

  const updateWorkingEntry = useCallback((chapterId: string, entryId: string, durationSeconds: number) => {
    setState(prev => ({
      ...prev,
      chapters: prev.chapters.map(ch =>
        ch.chapterId === chapterId
          ? {
              ...ch,
              workingEntries: ch.workingEntries.map(entry =>
                entry.id === entryId ? { ...entry, duration: durationSeconds } : entry
              ),
            }
          : ch
      ),
    }));
  }, []);

  const deleteWorkingEntry = useCallback((chapterId: string, entryId: string) => {
    setState(prev => ({
      ...prev,
      chapters: prev.chapters.map(ch =>
        ch.chapterId === chapterId
          ? {
              ...ch,
              workingEntries: ch.workingEntries.filter(entry => entry.id !== entryId),
            }
          : ch
      ),
    }));
  }, []);

  const getWorkingEntries = useCallback((chapterId: string): WorkingEntry[] => {
    const chapter = state.chapters.find(ch => ch.chapterId === chapterId);
    return chapter?.workingEntries || [];
  }, [state.chapters]);

  const getTotalRecordedTime = useCallback((chapterId: string): number => {
    const entries = getWorkingEntries(chapterId);
    return entries.reduce((sum, entry) => sum + entry.duration, 0);
  }, [getWorkingEntries]);

  return {
    startWorking,
    pauseWorking,
    stopWorking,
    isWorking,
    isPaused,
    getElapsedTime,
    getActiveChapters,
    addWorkingEntry,
    updateWorkingEntry,
    deleteWorkingEntry,
    getWorkingEntries,
    getTotalRecordedTime,
  };
}
