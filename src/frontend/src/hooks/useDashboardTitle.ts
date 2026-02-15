import { useState, useEffect } from 'react';

const STORAGE_KEY = 'dashboard-title';
const STORAGE_VERSION = 1;

interface StoredTitle {
  version: number;
  title: string;
}

export function useDashboardTitle() {
  const [title, setTitle] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: StoredTitle = JSON.parse(stored);
        if (data.version === STORAGE_VERSION && typeof data.title === 'string') {
          return data.title;
        }
      }
    } catch (error) {
      console.error('Failed to load dashboard title:', error);
    }
    return 'My Dashboard';
  });

  useEffect(() => {
    try {
      const data: StoredTitle = {
        version: STORAGE_VERSION,
        title,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save dashboard title:', error);
    }
  }, [title]);

  return {
    title,
    setTitle,
  };
}
