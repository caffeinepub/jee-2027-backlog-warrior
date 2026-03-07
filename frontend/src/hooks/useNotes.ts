import { useState, useEffect } from 'react';

export interface Note {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'notes';
const STORAGE_VERSION = 1;

interface StoredNotesData {
  version: number;
  notes: Note[];
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: StoredNotesData = JSON.parse(stored);
        if (data.version === STORAGE_VERSION && Array.isArray(data.notes)) {
          return data.notes;
        }
      }
    } catch (error) {
      console.error('Failed to load notes:', error);
    }
    return [];
  });

  useEffect(() => {
    try {
      const data: StoredNotesData = {
        version: STORAGE_VERSION,
        notes,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save notes:', error);
    }
  }, [notes]);

  const addNote = (title: string, body: string) => {
    if (!body.trim()) return;
    
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: title.trim(),
      body: body.trim(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    setNotes(prev => [newNote, ...prev]);
  };

  const updateNote = (id: string, title: string, body: string) => {
    if (!body.trim()) return;
    
    setNotes(prev => prev.map(note =>
      note.id === id
        ? { ...note, title: title.trim(), body: body.trim(), updatedAt: Date.now() }
        : note
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
  };
}
