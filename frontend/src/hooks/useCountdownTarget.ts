import { useState, useEffect } from 'react';

const STORAGE_KEY = 'countdown-target-date';

export function useCountdownTarget() {
  const [targetDate, setTargetDateState] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        // Validate the stored date
        const date = new Date(stored);
        if (!isNaN(date.getTime())) {
          setTargetDateState(stored);
        } else {
          // Invalid date, clear it
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('Failed to load countdown target date:', error);
    }
  }, []);

  const setTargetDate = (date: string | null) => {
    try {
      if (date) {
        // Validate before saving
        const dateObj = new Date(date);
        if (!isNaN(dateObj.getTime())) {
          localStorage.setItem(STORAGE_KEY, date);
          setTargetDateState(date);
        }
      } else {
        localStorage.removeItem(STORAGE_KEY);
        setTargetDateState(null);
      }
    } catch (error) {
      console.error('Failed to save countdown target date:', error);
    }
  };

  return {
    targetDate,
    setTargetDate,
  };
}
