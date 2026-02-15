import { useState, useEffect, useRef } from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { ChevronDown, Plus, BookOpen, X } from 'lucide-react';
import { useSubjects } from '../hooks/useSubjects';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export function SubjectsSelector() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { subjects, addSubject } = useSubjects();
  const [open, setOpen] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const currentPath = routerState.location.pathname;
  const activeSubjectId = currentPath.startsWith('/subject/')
    ? currentPath.split('/subject/')[1]
    : null;

  // Focus input when popover opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedName = newSubjectName.trim();
    if (!trimmedName) {
      setError('Subject name cannot be empty');
      return;
    }

    const success = addSubject(trimmedName);
    if (!success) {
      setError('Subject already exists');
      return;
    }

    setNewSubjectName('');
    setError('');
  };

  const handleSubjectClick = (subjectId: string) => {
    navigate({ to: `/subject/${subjectId}` });
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`shrink-0 flex flex-col items-center gap-1 px-4 py-2 min-w-[80px] transition-smooth icon-animated ${
            activeSubjectId
              ? 'bg-primary/10 text-primary border border-primary/30 shadow-glow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <ChevronDown className={`h-5 w-5 ${activeSubjectId ? 'icon-active' : ''}`} />
          <span className="text-xs font-medium">Subjects</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0 mb-2"
        align="center"
        side="top"
        onKeyDown={handleKeyDown}
      >
        <div className="flex flex-col max-h-[400px]">
          {/* Add Subject Form */}
          <div className="p-4 border-b border-border/60 bg-muted/30">
            <form onSubmit={handleAddSubject} className="space-y-2">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Add new subject..."
                  value={newSubjectName}
                  onChange={(e) => {
                    setNewSubjectName(e.target.value);
                    setError('');
                  }}
                  className="flex-1"
                />
                <Button type="submit" size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              {error && (
                <p className="text-xs text-destructive">{error}</p>
              )}
            </form>
          </div>

          {/* Subjects List */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              {subjects.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No subjects yet. Add one above!
                </div>
              ) : (
                <div className="space-y-1">
                  {subjects.map((subject) => {
                    const isActive = activeSubjectId === subject.id;
                    return (
                      <button
                        key={subject.id}
                        onClick={() => handleSubjectClick(subject.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-smooth ${
                          isActive
                            ? 'bg-primary/10 text-primary border border-primary/30 shadow-glow-sm'
                            : 'hover:bg-muted/50 text-foreground'
                        }`}
                      >
                        <BookOpen className={`h-4 w-4 shrink-0 ${isActive ? 'icon-active' : ''}`} />
                        <span className="text-sm font-medium truncate flex-1">
                          {subject.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
