import { useState, useEffect } from 'react';

export interface ScoreEntry {
  id: string;
  score: number;
  timestamp: number;
}

export interface Test {
  id: string;
  label: string;
  totalMarks: number;
  scores: ScoreEntry[];
  chartType: 'line' | 'bar';
  chartColor: string;
  createdAt: number;
}

const STORAGE_KEY = 'tests';
const STORAGE_VERSION = 1;

interface StoredTestsData {
  version: number;
  tests: Test[];
}

const DEFAULT_CHART_COLORS = [
  '#8b5cf6', // purple
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#ec4899', // pink
];

export function useTests() {
  const [tests, setTests] = useState<Test[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: StoredTestsData = JSON.parse(stored);
        if (data.version === STORAGE_VERSION && Array.isArray(data.tests)) {
          return data.tests;
        }
      }
    } catch (error) {
      console.error('Failed to load tests:', error);
    }
    return [];
  });

  useEffect(() => {
    try {
      const data: StoredTestsData = {
        version: STORAGE_VERSION,
        tests,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save tests:', error);
    }
  }, [tests]);

  const addTest = (label: string, totalMarks: number) => {
    if (!label.trim() || totalMarks <= 0) return;
    
    const colorIndex = tests.length % DEFAULT_CHART_COLORS.length;
    const newTest: Test = {
      id: `test-${Date.now()}`,
      label: label.trim(),
      totalMarks,
      scores: [],
      chartType: 'line',
      chartColor: DEFAULT_CHART_COLORS[colorIndex],
      createdAt: Date.now(),
    };
    
    setTests(prev => [...prev, newTest]);
  };

  const updateTest = (id: string, label: string, totalMarks: number) => {
    if (!label.trim() || totalMarks <= 0) return;
    
    setTests(prev => prev.map(test =>
      test.id === id
        ? { ...test, label: label.trim(), totalMarks }
        : test
    ));
  };

  const deleteTest = (id: string) => {
    setTests(prev => prev.filter(test => test.id !== id));
  };

  const addScore = (testId: string, score: number) => {
    setTests(prev => prev.map(test => {
      if (test.id === testId) {
        const newScore: ScoreEntry = {
          id: `score-${Date.now()}`,
          score,
          timestamp: Date.now(),
        };
        return { ...test, scores: [...test.scores, newScore] };
      }
      return test;
    }));
  };

  const updateScore = (testId: string, scoreId: string, newScore: number) => {
    setTests(prev => prev.map(test => {
      if (test.id === testId) {
        return {
          ...test,
          scores: test.scores.map(s =>
            s.id === scoreId ? { ...s, score: newScore } : s
          ),
        };
      }
      return test;
    }));
  };

  const deleteScore = (testId: string, scoreId: string) => {
    setTests(prev => prev.map(test => {
      if (test.id === testId) {
        return {
          ...test,
          scores: test.scores.filter(s => s.id !== scoreId),
        };
      }
      return test;
    }));
  };

  const updateChartSettings = (testId: string, chartType: 'line' | 'bar', chartColor: string) => {
    setTests(prev => prev.map(test =>
      test.id === testId
        ? { ...test, chartType, chartColor }
        : test
    ));
  };

  return {
    tests,
    addTest,
    updateTest,
    deleteTest,
    addScore,
    updateScore,
    deleteScore,
    updateChartSettings,
  };
}
