import { useState, useEffect } from 'react';

const STORAGE_KEY = 'dashboard-note';
const STORAGE_VERSION = 1;

interface StoredNote {
  version: number;
  note: string;
}

export function useDashboardNote() {
  const [note, setNote] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: StoredNote = JSON.parse(stored);
        if (data.version === STORAGE_VERSION && typeof data.note === 'string') {
          return data.note;
        }
      }
    } catch (error) {
      console.error('Failed to load dashboard note:', error);
    }
    return '';
  });

  useEffect(() => {
    try {
      const data: StoredNote = {
        version: STORAGE_VERSION,
        note,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save dashboard note:', error);
    }
  }, [note]);

  return {
    note,
    setNote,
  };
}
