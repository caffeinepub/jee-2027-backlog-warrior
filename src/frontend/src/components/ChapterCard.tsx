import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { type Chapter } from '../data/chapters';
import { useCustomization } from '../customization/CustomizationProvider';
import { Clock, BookOpen, Play, Square, Pause, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface WorkingEntry {
  id: string;
  duration: number;
  timestamp: number;
}

interface ChapterCardProps {
  chapter: Chapter;
  onClick: () => void;
  isCurrentlyWorking?: boolean;
  isPaused?: boolean;
  elapsedSeconds?: number;
  onStartWorking?: () => void;
  onPauseWorking?: () => void;
  onStopWorking?: () => void;
  workingEntries?: WorkingEntry[];
  onAddEntry?: (duration: number) => void;
  onUpdateEntry?: (entryId: string, duration: number) => void;
  onDeleteEntry?: (entryId: string) => void;
  onDelete?: () => void;
}

function formatElapsedTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

export function ChapterCard({ 
  chapter, 
  onClick, 
  isCurrentlyWorking = false,
  isPaused = false,
  elapsedSeconds = 0,
  onStartWorking,
  onPauseWorking,
  onStopWorking,
  workingEntries = [],
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry,
  onDelete,
}: ChapterCardProps) {
  const { settings, draftSettings } = useCustomization();
  const activeSettings = draftSettings || settings;
  const isCompact = activeSettings.chapterCardSize === 'compact';
  
  const [showEntries, setShowEntries] = useState(false);
  const [newEntryMinutes, setNewEntryMinutes] = useState('');
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editingMinutes, setEditingMinutes] = useState('');
  
  const isCompleted = chapter.status === 'Completed';
  
  const statusColors = {
    'Not Started': 'bg-muted text-muted-foreground border-muted',
    'Incomplete': 'bg-warning/20 text-warning border-warning/30',
    'Tough': 'bg-destructive/20 text-destructive border-destructive/30',
    'Completed': 'bg-success/20 text-success border-success/30',
  };

  const computedTargetHours = (chapter.totalLectures * chapter.lectureDuration) / (activeSettings.lectureSpeedFactor * 60);
  const effectiveTargetHours = chapter.targetHoursOverride !== undefined 
    ? chapter.targetHoursOverride 
    : computedTargetHours;

  const handleWorkingToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentlyWorking) {
      if (isPaused) {
        onStartWorking?.();
      } else {
        onPauseWorking?.();
      }
    } else {
      onStartWorking?.();
    }
  };

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStopWorking?.();
  };

  const handleAddEntry = (e: React.MouseEvent) => {
    e.stopPropagation();
    const minutes = parseFloat(newEntryMinutes);
    if (isNaN(minutes) || minutes <= 0) {
      toast.error('Please enter a valid duration in minutes');
      return;
    }
    onAddEntry?.(Math.floor(minutes * 60));
    setNewEntryMinutes('');
    toast.success('Working time entry added');
  };

  const handleUpdateEntry = (e: React.MouseEvent, entryId: string) => {
    e.stopPropagation();
    const minutes = parseFloat(editingMinutes);
    if (isNaN(minutes) || minutes <= 0) {
      toast.error('Please enter a valid duration in minutes');
      return;
    }
    onUpdateEntry?.(entryId, Math.floor(minutes * 60));
    setEditingEntryId(null);
    toast.success('Entry updated');
  };

  const handleDeleteEntry = (e: React.MouseEvent, entryId: string) => {
    e.stopPropagation();
    onDeleteEntry?.(entryId);
    toast.success('Entry deleted');
  };

  const totalRecordedTime = workingEntries.reduce((sum, entry) => sum + entry.duration, 0);

  return (
    <Card 
      className={`cursor-pointer transition-smooth hover-lift group ${
        isCompleted 
          ? 'bg-gradient-to-br from-success/10 to-success/5 border-success/40 hover:border-success/60 shadow-glow-sm' 
          : 'bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/50 hover:shadow-elevated'
      }`}
      onClick={onClick}
    >
      <CardHeader className={isCompact ? 'pb-3' : ''}>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className={`${isCompact ? 'text-base' : 'text-lg'} transition-smooth group-hover:text-primary flex-1`}>
            {chapter.name}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={`${statusColors[chapter.status]} transition-smooth-fast`} variant="outline">
              {chapter.status}
            </Badge>
            {onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Chapter</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{chapter.name}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                        toast.success('Chapter deleted successfully!');
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
        </div>
        {isCurrentlyWorking && (
          <Badge className={`${isPaused ? 'bg-warning/20 text-warning border-warning/30' : 'bg-primary/20 text-primary border-primary/30 animate-pulse-glow'} mt-2 w-fit transition-smooth`}>
            <Clock className="h-3 w-3 mr-1" />
            {formatElapsedTime(elapsedSeconds)}
            {isPaused && <span className="ml-1">(Paused)</span>}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4" />
          <span>{chapter.totalLectures} lectures</span>
          <span className="text-xs">•</span>
          <span>
            Target: {effectiveTargetHours.toFixed(1)}h
            {chapter.targetHoursOverride !== undefined && (
              <span className="ml-1 text-xs text-primary">(Override)</span>
            )}
          </span>
        </div>

        {/* Working Controls */}
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          {!isCurrentlyWorking ? (
            <Button
              size="sm"
              variant="outline"
              onClick={handleWorkingToggle}
              className="flex-1 transition-smooth-fast hover:bg-primary/10 hover:text-primary hover:border-primary"
            >
              <Play className="h-4 w-4 mr-1" />
              Start Working
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={handleWorkingToggle}
                className={`flex-1 transition-smooth-fast ${
                  isPaused 
                    ? 'hover:bg-primary/10 hover:text-primary hover:border-primary' 
                    : 'hover:bg-warning/10 hover:text-warning hover:border-warning'
                }`}
              >
                {isPaused ? (
                  <>
                    <Play className="h-4 w-4 mr-1" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="h-4 w-4 mr-1" />
                    Pause
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleStop}
                className="transition-smooth-fast hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
              >
                <Square className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {/* Recorded Working Time Entries */}
        {workingEntries.length > 0 && (
          <div className="pt-2 border-t border-border/50">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowEntries(!showEntries);
              }}
              className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 transition-smooth-fast"
            >
              <Clock className="h-3 w-3" />
              Total Recorded: {formatDuration(totalRecordedTime)}
              <span className="text-xs ml-1">({workingEntries.length} {workingEntries.length === 1 ? 'entry' : 'entries'})</span>
            </button>

            {showEntries && (
              <div className="mt-2 space-y-2 animate-fade-in">
                {workingEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between gap-2 text-xs bg-muted/30 p-2 rounded-md transition-smooth hover:bg-muted/50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {editingEntryId === entry.id ? (
                      <>
                        <Input
                          type="number"
                          value={editingMinutes}
                          onChange={(e) => setEditingMinutes(e.target.value)}
                          placeholder="Minutes"
                          className="h-7 text-xs flex-1"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 hover:bg-success/10 hover:text-success transition-smooth-fast"
                            onClick={(e) => handleUpdateEntry(e, entry.id)}
                          >
                            <Save className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive transition-smooth-fast"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingEntryId(null);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="text-muted-foreground">
                          {formatDuration(entry.duration)} • {new Date(entry.timestamp).toLocaleDateString()}
                        </span>
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 hover:bg-primary/10 hover:text-primary transition-smooth-fast"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingEntryId(entry.id);
                              setEditingMinutes(Math.floor(entry.duration / 60).toString());
                            }}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive transition-smooth-fast"
                            onClick={(e) => handleDeleteEntry(e, entry.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}

                {/* Add New Entry */}
                <div className="flex gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                  <Input
                    type="number"
                    value={newEntryMinutes}
                    onChange={(e) => setNewEntryMinutes(e.target.value)}
                    placeholder="Add minutes..."
                    className="h-8 text-xs flex-1"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleAddEntry}
                    className="h-8 transition-smooth-fast hover:bg-primary/10 hover:text-primary hover:border-primary"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
