import { useState, useEffect } from 'react';
import { LEGACY_SUBJECT_NAME_MAP } from '../data/subjects';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  subjectId: string;
}

const STORAGE_KEY = 'jee-todos';
const STORAGE_VERSION = 2;

interface StoredTodos {
  version: number;
  todos: Todo[];
}

// Legacy todo type for migration
interface LegacyTodo {
  id: string;
  text: string;
  completed: boolean;
  subject?: string;
  subjectId?: string;
}

function migrateTodos(todos: LegacyTodo[]): Todo[] {
  return todos.map(todo => {
    if (todo.subjectId) {
      return todo as Todo;
    }
    // Migrate old subject field to subjectId
    const legacySubject = todo.subject || 'Mathematics';
    const subjectId = LEGACY_SUBJECT_NAME_MAP[legacySubject] || 'mathematics';
    return {
      ...todo,
      subjectId,
    } as Todo;
  });
}

export function useTodos(subjectId: string) {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        
        // Handle versioned storage
        if (data.version === STORAGE_VERSION) {
          return data.todos.filter((t: Todo) => t.subjectId === subjectId);
        }
        
        // Handle legacy storage (array or old version)
        const legacyTodos = Array.isArray(data) ? data : (data.todos || []);
        if (legacyTodos.length > 0) {
          const migratedTodos = migrateTodos(legacyTodos);
          return migratedTodos.filter(t => t.subjectId === subjectId);
        }
      }
    } catch (error) {
      console.error('Failed to load todos:', error);
    }
    return [];
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const data = stored ? JSON.parse(stored) : { version: STORAGE_VERSION, todos: [] };
      
      let allTodos: Todo[] = [];
      if (data.version === STORAGE_VERSION) {
        allTodos = data.todos;
      } else {
        const legacyTodos = Array.isArray(data) ? data : (data.todos || []);
        allTodos = migrateTodos(legacyTodos);
      }
      
      const otherTodos = allTodos.filter(t => t.subjectId !== subjectId);
      const updatedTodos = [...otherTodos, ...todos];
      
      const storageData: StoredTodos = {
        version: STORAGE_VERSION,
        todos: updatedTodos,
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
    } catch (error) {
      console.error('Failed to save todos:', error);
    }
  }, [todos, subjectId]);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: `${subjectId}-${Date.now()}`,
      text,
      completed: false,
      subjectId,
    };
    setTodos(prev => [...prev, newTodo]);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
  };
}
