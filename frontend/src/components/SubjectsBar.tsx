import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Plus, X } from 'lucide-react';
import { useSubjects } from '../hooks/useSubjects';
import { getSubjectIcon } from '../data/subjects';
import { Button } from './ui/button';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useState } from 'react';
import { toast } from 'sonner';

export function SubjectsBar() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { subjects, addSubject, deleteSubject } = useSubjects();
  const [newSubjectName, setNewSubjectName] = useState('');
  const [error, setError] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const currentPath = routerState.location.pathname;
  const activeSubjectId = currentPath.startsWith('/subject/')
    ? currentPath.split('/subject/')[1]
    : null;

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
    setAddDialogOpen(false);
    toast.success(`Subject "${trimmedName}" added successfully!`);
  };

  const handleDeleteSubject = (subjectId: string, subjectName: string) => {
    const success = deleteSubject(subjectId);
    if (success) {
      toast.success(`Subject "${subjectName}" deleted successfully!`);
      // If we're currently viewing this subject, navigate home
      if (activeSubjectId === subjectId) {
        navigate({ to: '/' });
      }
    } else {
      toast.error('Cannot delete default subjects');
    }
  };

  const handleSubjectClick = (subjectId: string) => {
    navigate({ to: `/subject/${subjectId}` });
  };

  return (
    <div className="w-full border-t border-border/60 bg-card/95 backdrop-blur-xl supports-[backdrop-filter]:bg-card/80">
      <ScrollArea className="w-full">
        <div className="flex items-center gap-2 px-3 py-2">
          {subjects.map((subject) => {
            const Icon = getSubjectIcon(subject.name);
            const isActive = activeSubjectId === subject.id;
            const canDelete = !subject.isDefault;

            return (
              <div
                key={subject.id}
                className={`relative shrink-0 group ${
                  isActive ? 'ring-2 ring-primary/50 rounded-lg' : ''
                }`}
              >
                <button
                  onClick={() => handleSubjectClick(subject.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-smooth icon-animated ${
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/30 shadow-glow-sm'
                      : 'bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent'
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'icon-active' : ''}`} />
                  <span className="text-sm font-medium whitespace-nowrap">
                    {subject.name}
                  </span>
                </button>
                
                {canDelete && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-destructive/90 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-destructive shadow-md"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Subject</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{subject.name}"? This will also delete all chapters associated with this subject. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSubject(subject.id, subject.name);
                          }}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            );
          })}

          {/* Add Subject Button */}
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0 flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 icon-animated"
              >
                <Plus className="h-4 w-4" />
                <span className="text-sm font-medium whitespace-nowrap">Add Subject</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Subject</DialogTitle>
                <DialogDescription>
                  Enter a name for your new subject. You can add chapters and resources to it later.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddSubject}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject-name">Subject Name</Label>
                    <Input
                      id="subject-name"
                      placeholder="e.g., Biology, Computer Science"
                      value={newSubjectName}
                      onChange={(e) => {
                        setNewSubjectName(e.target.value);
                        setError('');
                      }}
                      autoFocus
                    />
                    {error && (
                      <p className="text-xs text-destructive">{error}</p>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="ghost" onClick={() => setAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Subject</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
