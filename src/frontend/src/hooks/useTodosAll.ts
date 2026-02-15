import { useState, useEffect } from 'react';
import { type Todo } from './useTodos';

const STORAGE_KEY = 'jee-todos';
const STORAGE_VERSION = 2;

interface StoredTodos {
  version: number;
  todos: Todo[];
}

export function useTodosAll() {
  const [allTodos, setAllTodos] = useState<Todo[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        if (data.version === STORAGE_VERSION) {
          return data.todos || [];
        }
      }
    } catch (error) {
      console.error('Failed to load all todos:', error);
    }
    return [];
  });

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const data: StoredTodos = JSON.parse(stored);
          if (data.version === STORAGE_VERSION) {
            setAllTodos(data.todos || []);
          }
        }
      } catch (error) {
        console.error('Failed to reload todos:', error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const getAllTodos = () => allTodos;

  return {
    getAllTodos,
  };
}
