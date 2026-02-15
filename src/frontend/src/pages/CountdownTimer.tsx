import { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Trash2, Pencil } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useCountdownTimers } from '../hooks/useCountdownTimers';
import { useCountdownTimer } from '../hooks/useCountdownTimer';

export function CountdownTimer() {
  const {
    timers,
    selectedTimer,
    createTimer,
    selectTimer,
    updateTimerTargetDate,
    renameTimer,
    deleteTimer,
  } = useCountdownTimers();

  const { days, hours, minutes, seconds, isExpired } = useCountdownTimer(
    selectedTimer?.targetDate || null
  );

  const [dateTimeInput, setDateTimeInput] = useState('');
  const [newTimerLabel, setNewTimerLabel] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTimerId, setEditingTimerId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [deleteConfirmTimerId, setDeleteConfirmTimerId] = useState<string | null>(null);

  // Initialize input from selected timer's target date
  useEffect(() => {
    if (selectedTimer?.targetDate) {
      const date = new Date(selectedTimer.targetDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hour = String(date.getHours()).padStart(2, '0');
      const minute = String(date.getMinutes()).padStart(2, '0');
      setDateTimeInput(`${year}-${month}-${day}T${hour}:${minute}`);
    } else {
      setDateTimeInput('');
    }
  }, [selectedTimer]);

  const handleDateTimeChange = (value: string) => {
    setDateTimeInput(value);
    if (value && selectedTimer) {
      const newDate = new Date(value);
      if (!isNaN(newDate.getTime())) {
        updateTimerTargetDate(selectedTimer.id, newDate.toISOString());
      }
    }
  };

  const handleCreateTimer = () => {
    if (newTimerLabel.trim()) {
      createTimer(newTimerLabel.trim());
      setNewTimerLabel('');
      setIsCreateDialogOpen(false);
    }
  };

  const handleStartEdit = (timerId: string, currentLabel: string) => {
    setEditingTimerId(timerId);
    setEditLabel(currentLabel);
  };

  const handleSaveEdit = () => {
    if (editingTimerId && editLabel.trim()) {
      renameTimer(editingTimerId, editLabel.trim());
      setEditingTimerId(null);
      setEditLabel('');
    }
  };

  const handleCancelEdit = () => {
    setEditingTimerId(null);
    setEditLabel('');
  };

  const handleDeleteFromList = (timerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirmTimerId(timerId);
  };

  const confirmDelete = () => {
    if (deleteConfirmTimerId) {
      deleteTimer(deleteConfirmTimerId);
      setDeleteConfirmTimerId(null);
    }
  };

  return (
    <div className="countdown-page min-h-screen pb-24 pt-6 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold countdown-title">
            Countdown Timer
          </h1>
          <p className="countdown-subtitle text-lg">
            Create and manage multiple countdown timers
          </p>
        </div>

        {/* Timer Selection & Create */}
        <Card className="countdown-card animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xl">
                <Clock className="h-5 w-5" />
                Select Timer
              </span>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Timer
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Timer</DialogTitle>
                    <DialogDescription>
                      Give your countdown timer a name to help you identify it.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="timer-label">Timer Label *</Label>
                      <Input
                        id="timer-label"
                        placeholder="e.g., Exam Day, Birthday, Vacation"
                        value={newTimerLabel}
                        onChange={(e) => setNewTimerLabel(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newTimerLabel.trim()) {
                            handleCreateTimer();
                          }
                        }}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsCreateDialogOpen(false);
                        setNewTimerLabel('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateTimer}
                      disabled={!newTimerLabel.trim()}
                    >
                      Create Timer
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {timers.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Select
                    value={selectedTimer?.id || ''}
                    onValueChange={selectTimer}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select a timer" />
                    </SelectTrigger>
                    <SelectContent>
                      {timers.map((timer) => (
                        <div
                          key={timer.id}
                          className="flex items-center justify-between gap-2 px-2 py-1.5 hover:bg-accent rounded-sm group"
                        >
                          <SelectItem
                            value={timer.id}
                            className="flex-1 cursor-pointer border-0 focus:bg-transparent"
                          >
                            {timer.label}
                          </SelectItem>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => handleDeleteFromList(timer.id, e)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedTimer && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                      onClick={() => handleStartEdit(selectedTimer.id, selectedTimer.label)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No timers yet. Click "New Timer" to create one.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Date Picker Card */}
        {selectedTimer && (
          <Card className="countdown-card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Calendar className="h-5 w-5" />
                Set Target Date & Time
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="target-datetime" className="text-base">
                  Choose target date and time for "{selectedTimer.label}"
                </Label>
                <Input
                  id="target-datetime"
                  type="datetime-local"
                  value={dateTimeInput}
                  onChange={(e) => handleDateTimeChange(e.target.value)}
                  className="countdown-input text-lg h-12"
                />
                <p className="text-sm countdown-help-text">
                  Select a future date and time to start the countdown
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Countdown Display */}
        {selectedTimer && (
          <Card className="countdown-display-card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Clock className="h-5 w-5" />
                {selectedTimer.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isExpired ? (
                <div className="text-center py-12">
                  <p className="text-3xl md:text-4xl font-bold countdown-expired">
                    🎉 Time is up! 🎉
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  <div className="countdown-segment">
                    <div className="countdown-number">{String(days).padStart(2, '0')}</div>
                    <div className="countdown-label">Days</div>
                  </div>
                  <div className="countdown-segment">
                    <div className="countdown-number">{String(hours).padStart(2, '0')}</div>
                    <div className="countdown-label">Hours</div>
                  </div>
                  <div className="countdown-segment">
                    <div className="countdown-number">{String(minutes).padStart(2, '0')}</div>
                    <div className="countdown-label">Mins</div>
                  </div>
                  <div className="countdown-segment">
                    <div className="countdown-number">{String(seconds).padStart(2, '0')}</div>
                    <div className="countdown-label">Secs</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {timers.length === 0 && (
          <Card className="countdown-empty-card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <CardContent className="py-12 text-center">
              <Clock className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl countdown-empty-text mb-4">
                Create your first countdown timer
              </p>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="gap-2">
                    <Plus className="h-5 w-5" />
                    New Timer
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Timer</DialogTitle>
                    <DialogDescription>
                      Give your countdown timer a name to help you identify it.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="timer-label-empty">Timer Label *</Label>
                      <Input
                        id="timer-label-empty"
                        placeholder="e.g., Exam Day, Birthday, Vacation"
                        value={newTimerLabel}
                        onChange={(e) => setNewTimerLabel(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newTimerLabel.trim()) {
                            handleCreateTimer();
                          }
                        }}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsCreateDialogOpen(false);
                        setNewTimerLabel('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateTimer}
                      disabled={!newTimerLabel.trim()}
                    >
                      Create Timer
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Timer Dialog */}
      <Dialog open={editingTimerId !== null} onOpenChange={(open) => !open && handleCancelEdit()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Timer</DialogTitle>
            <DialogDescription>
              Enter a new name for your countdown timer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-timer-label">Timer Label *</Label>
              <Input
                id="edit-timer-label"
                placeholder="e.g., Exam Day, Birthday, Vacation"
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && editLabel.trim()) {
                    handleSaveEdit();
                  } else if (e.key === 'Escape') {
                    handleCancelEdit();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={!editLabel.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmTimerId !== null} onOpenChange={(open) => !open && setDeleteConfirmTimerId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Timer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{timers.find((t) => t.id === deleteConfirmTimerId)?.label}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirmTimerId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
