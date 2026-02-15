import { useState } from 'react';
import { Menu, StickyNote } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { useSubjects } from '../hooks/useSubjects';
import { useTodos } from '../hooks/useTodos';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Trash2, Plus } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Separator } from './ui/separator';

export function TasksDrawer() {
  const navigate = useNavigate();
  const { subjects } = useSubjects();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    subjects.length > 0 ? subjects[0].id : ''
  );
  const [newTodo, setNewTodo] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos(selectedSubjectId);
  const selectedSubject = subjects.find(s => s.id === selectedSubjectId);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      addTodo(newTodo.trim());
      setNewTodo('');
    }
  };

  // Update selected subject if it becomes invalid
  if (selectedSubjectId && !selectedSubject && subjects.length > 0) {
    setSelectedSubjectId(subjects[0].id);
  }

  const handleNavigateToNotes = () => {
    setIsOpen(false);
    navigate({ to: '/notes' });
  };

  const handleNavigateToTests = () => {
    setIsOpen(false);
    navigate({ to: '/tests' });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[90vw] sm:w-[400px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 flex-1 flex flex-col min-h-0">
          {/* Navigation Links */}
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleNavigateToNotes}
            >
              <StickyNote className="h-4 w-4 mr-2" />
              Notes
            </Button>
          </div>

          <Separator />

          {/* Tasks Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Tasks</h3>
            <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
              <SelectTrigger>
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
                  className="flex-1"
                />
                <Button type="submit" size="icon">
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
                        className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
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
                          className="h-8 w-8"
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
