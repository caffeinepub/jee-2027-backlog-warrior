import { useState, useEffect } from 'react';

const STORAGE_KEY = 'dashboard-inside';
const STORAGE_VERSION = 1;

interface StoredInside {
  version: number;
  content: string;
}

export function useDashboardInside() {
  const [content, setContent] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: StoredInside = JSON.parse(stored);
        if (data.version === STORAGE_VERSION && typeof data.content === 'string') {
          return data.content;
        }
      }
    } catch (error) {
      console.error('Failed to load dashboard inside content:', error);
    }
    return '';
  });

  useEffect(() => {
    try {
      const data: StoredInside = {
        version: STORAGE_VERSION,
        content,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save dashboard inside content:', error);
    }
  }, [content]);

  return {
    content,
    setContent,
  };
}
