import { useState, useEffect } from 'react';

export interface CalendarEntry {
  id: string;
  text: string;
  dateKey: string;
}

const STORAGE_KEY = 'calendar-entries';
const STORAGE_VERSION = 1;

interface StoredCalendarData {
  version: number;
  entries: Record<string, CalendarEntry[]>;
}

export function useCalendarEntries() {
  const [entries, setEntries] = useState<Record<string, CalendarEntry[]>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: StoredCalendarData = JSON.parse(stored);
        if (data.version === STORAGE_VERSION && data.entries) {
          return data.entries;
        }
      }
    } catch (error) {
      console.error('Failed to load calendar entries:', error);
    }
    return {};
  });

  useEffect(() => {
    try {
      const data: StoredCalendarData = {
        version: STORAGE_VERSION,
        entries,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save calendar entries:', error);
    }
  }, [entries]);

  const getEntriesForDate = (dateKey: string): CalendarEntry[] => {
    return entries[dateKey] || [];
  };

  const getAllEntries = () => {
    return entries;
  };

  const addEntry = (dateKey: string, text: string) => {
    const newEntry: CalendarEntry = {
      id: `${dateKey}-${Date.now()}`,
      text,
      dateKey,
    };
    
    setEntries(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newEntry],
    }));
  };

  const updateEntry = (dateKey: string, entryId: string, newText: string) => {
    setEntries(prev => ({
      ...prev,
      [dateKey]: (prev[dateKey] || []).map(entry =>
        entry.id === entryId ? { ...entry, text: newText } : entry
      ),
    }));
  };

  const deleteEntry = (dateKey: string, entryId: string) => {
    setEntries(prev => ({
      ...prev,
      [dateKey]: (prev[dateKey] || []).filter(entry => entry.id !== entryId),
    }));
  };

  return {
    getEntriesForDate,
    getAllEntries,
    addEntry,
    updateEntry,
    deleteEntry,
  };
}
