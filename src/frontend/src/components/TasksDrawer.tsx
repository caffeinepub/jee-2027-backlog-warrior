import { useState, useEffect } from 'react';
import { Menu, StickyNote, Home, Calendar, Timer, FileText, ClipboardList, Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { useSubjects } from '../hooks/useSubjects';
import { useTodos } from '../hooks/useTodos';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Separator } from './ui/separator';

export function TasksDrawer() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { subjects } = useSubjects();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    subjects.length > 0 ? subjects[0].id : ''
  );
  const [newTodo, setNewTodo] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos(selectedSubjectId);
  const selectedSubject = subjects.find(s => s.id === selectedSubjectId);

  const currentPath = routerState.location.pathname;

  // Update selected subject if it becomes invalid (use effect to avoid state update during render)
  useEffect(() => {
    if (selectedSubjectId && !selectedSubject && subjects.length > 0) {
      setSelectedSubjectId(subjects[0].id);
    }
  }, [selectedSubjectId, selectedSubject, subjects]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      addTodo(newTodo.trim());
      setNewTodo('');
    }
  };

  const handleNavigate = (path: string) => {
    setIsOpen(false);
    navigate({ to: path });
  };

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/calendar', label: 'Calendar', icon: Calendar },
    { path: '/countdown', label: 'Countdown', icon: Timer },
    { path: '/notes', label: 'Notes', icon: FileText },
    { path: '/tests', label: 'Tests', icon: ClipboardList },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 transition-smooth-fast hover:bg-primary/10 hover:text-primary">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[90vw] sm:w-[400px] flex flex-col bg-card/95 backdrop-blur-xl border-border/60 animate-slide-in-left">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 flex-1 flex flex-col min-h-0">
          {/* Navigation Links */}
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Button
                  key={item.path}
                  variant={active ? "default" : "outline"}
                  className={`w-full justify-start transition-smooth-fast ${
                    active
                      ? 'bg-primary text-primary-foreground shadow-glow-sm'
                      : 'hover:bg-primary/10 hover:text-primary hover:border-primary/50'
                  }`}
                  onClick={() => handleNavigate(item.path)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              );
            })}
          </div>

          <Separator className="bg-border/60" />

          {/* Tasks Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Tasks</h3>
            <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
              <SelectTrigger className="transition-smooth-fast focus:border-primary/50">
                <SelectValue placeholder="Choose a subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(subject => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Add Todo Form */}
          {selectedSubject && (
            <>
              <form onSubmit={handleAddTodo} className="flex gap-2">
                <Input
                  placeholder="Add a new task..."
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  className="flex-1 transition-smooth-fast focus:border-primary/50"
                />
                <Button type="submit" size="icon" className="transition-smooth-fast hover:scale-105">
                  <Plus className="h-4 w-4" />
                </Button>
              </form>

              {/* Todo List */}
              <ScrollArea className="flex-1 -mx-6 px-6">
                <div className="space-y-2 pr-4">
                  {todos.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="text-sm">No tasks yet</p>
                      <p className="text-xs mt-1">Add one to get started!</p>
                    </div>
                  ) : (
                    todos.map((todo) => (
                      <div
                        key={todo.id}
                        className="flex items-center gap-3 p-3 border border-border/60 rounded-lg hover:bg-muted/50 transition-smooth-fast hover:border-primary/30 animate-scale-in"
                      >
                        <Checkbox
                          checked={todo.completed}
                          onCheckedChange={() => toggleTodo(todo.id)}
                        />
                        <span
                          className={`flex-1 text-sm ${
                            todo.completed ? 'line-through text-muted-foreground' : ''
                          }`}
                        >
                          {todo.text}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 transition-smooth-fast hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => deleteTodo(todo.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </>
          )}

          {subjects.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No subjects available</p>
              <p className="text-xs mt-1">Add a subject from the dashboard</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
