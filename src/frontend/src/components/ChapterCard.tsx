import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
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
    'Not Started': 'bg-muted text-muted-foreground',
    'Incomplete': 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    'Tough': 'bg-destructive/10 text-destructive',
    'Completed': 'bg-green-500/10 text-green-600 dark:text-green-400',
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
      className={`cursor-pointer transition-all hover:shadow-lg ${
        isCompleted 
          ? 'bg-green-500/20 border-green-500 dark:bg-green-500/10 dark:border-green-600 hover:border-green-600 dark:hover:border-green-500' 
          : 'hover:border-primary/50'
      }`}
      onClick={onClick}
    >
      <CardHeader className={isCompact ? 'pb-3' : ''}>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className={isCompact ? 'text-base' : 'text-lg'}>{chapter.name}</CardTitle>
          <Badge className={statusColors[chapter.status]} variant="outline">
            {chapter.status}
          </Badge>
        </div>
        {isCurrentlyWorking && (
          <Badge className={`${isPaused ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' : 'bg-primary/10 text-primary'} border-primary/20 mt-2 w-fit`}>
            <Clock className="h-3 w-3 mr-1" />
            {formatElapsedTime(elapsedSeconds)}
            {isPaused && <span className="ml-1">(Paused)</span>}
          </Badge>
        )}
      </CardHeader>
      <CardContent className={isCompact ? 'pt-0 space-y-1' : 'space-y-2'}>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4" />
          <span>{chapter.totalLectures} lectures</span>
        </div>
        {!isCompact && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {effectiveTargetHours.toFixed(1)} hours target
              {chapter.targetHoursOverride !== undefined && (
                <span className="text-xs ml-1">(override)</span>
              )}
            </span>
          </div>
        )}
        
        {/* Working Controls */}
        {onStartWorking && onPauseWorking && onStopWorking && (
          <div className="space-y-2 pt-2" onClick={(e) => e.stopPropagation()}>
            <div className="flex gap-2">
              <Button
                variant={isCurrentlyWorking && !isPaused ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={handleWorkingToggle}
              >
                {isCurrentlyWorking ? (
                  isPaused ? (
                    <>
                      <Play className="h-3 w-3 mr-2" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause className="h-3 w-3 mr-2" />
                      Pause
                    </>
                  )
                ) : (
                  <>
                    <Play className="h-3 w-3 mr-2" />
                    Start Working
                  </>
                )}
              </Button>
              {isCurrentlyWorking && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleStop}
                >
                  <Square className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Recorded Entries Section */}
            <div className="border-t pt-2 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Recorded: {formatDuration(totalRecordedTime)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowEntries(!showEntries);
                  }}
                  className="h-6 text-xs"
                >
                  {showEntries ? 'Hide' : 'Show'} Entries
                </Button>
              </div>

              {showEntries && (
                <div className="space-y-2">
                  {/* Add Entry Form */}
                  <div className="flex gap-1">
                    <Input
                      type="number"
                      placeholder="Minutes"
                      value={newEntryMinutes}
                      onChange={(e) => setNewEntryMinutes(e.target.value)}
                      className="h-8 text-xs"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Button
                      size="sm"
                      onClick={handleAddEntry}
                      className="h-8 px-2"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Entries List */}
                  {workingEntries.length > 0 && (
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {workingEntries.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-center gap-1 text-xs bg-muted/50 rounded p-1"
                        >
                          {editingEntryId === entry.id ? (
                            <>
                              <Input
                                type="number"
                                value={editingMinutes}
                                onChange={(e) => setEditingMinutes(e.target.value)}
                                className="h-6 text-xs flex-1"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => handleUpdateEntry(e, entry.id)}
                                className="h-6 w-6 p-0"
                              >
                                <Save className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingEntryId(null);
                                }}
                                className="h-6 w-6 p-0"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <span className="flex-1">{formatDuration(entry.duration)}</span>
                              <span className="text-muted-foreground">
                                {new Date(entry.timestamp).toLocaleDateString()}
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingEntryId(entry.id);
                                  setEditingMinutes(Math.floor(entry.duration / 60).toString());
                                }}
                                className="h-6 w-6 p-0"
                              >
                                <Edit2 className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => handleDeleteEntry(e, entry.id)}
                                className="h-6 w-6 p-0"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
