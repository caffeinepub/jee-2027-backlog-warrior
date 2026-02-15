import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { type Chapter } from '../data/chapters';
import { Clock, BookOpen, Play, Square, Pause, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

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
  onResumeWorking?: () => void;
  onStopWorking?: () => void;
  workingEntries?: WorkingEntry[];
  onAddEntry?: (duration: number) => void;
  onUpdateEntry?: (entryId: string, duration: number) => void;
  onDeleteEntry?: (entryId: string) => void;
  onDelete?: () => void;
}

export function ChapterCard({
  chapter,
  onClick,
  isCurrentlyWorking = false,
  isPaused = false,
  elapsedSeconds = 0,
  onStartWorking,
  onPauseWorking,
  onResumeWorking,
  onStopWorking,
  onDelete,
}: ChapterCardProps) {
  const [liveElapsed, setLiveElapsed] = useState(elapsedSeconds);

  // Live timer update
  useEffect(() => {
    setLiveElapsed(elapsedSeconds);
    
    if (isCurrentlyWorking && !isPaused) {
      const interval = setInterval(() => {
        setLiveElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isCurrentlyWorking, isPaused, elapsedSeconds]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-success/20 text-success border-success/30';
      case 'Incomplete':
        return 'bg-warning/20 text-warning border-warning/30';
      case 'Tough':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const isCompleted = chapter.status === 'Completed';
  const targetHours = chapter.targetHoursOverride ?? (chapter.totalLectures * chapter.lectureDuration) / 60;

  const handleTimerAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-300 cursor-pointer
        ${isCompleted 
          ? 'bg-gradient-to-br from-success/10 via-card/80 to-card/80 border-success/30 hover:border-success/50' 
          : 'bg-card/80 border-border/50 hover:border-primary/30'
        }
        ${isCurrentlyWorking && !isPaused ? 'ring-2 ring-primary/50 shadow-glow-primary' : ''}
        backdrop-blur-sm hover:shadow-elevated hover:-translate-y-1`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold line-clamp-2 flex-1">
            {chapter.name}
          </CardTitle>
          <div className="flex items-center gap-1 shrink-0">
            <Badge variant="outline" className={getStatusColor(chapter.status)}>
              {chapter.status}
            </Badge>
            <AlertDialog>
              <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20 hover:text-destructive"
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
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.();
                    }}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Live Timer Display */}
        {isCurrentlyWorking && (
          <div className="mt-2 flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-primary animate-pulse" />
            <span className="font-mono font-semibold text-primary">
              {formatTime(liveElapsed)}
            </span>
            {isPaused && (
              <Badge variant="outline" className="bg-warning/20 text-warning border-warning/30 text-xs">
                Paused
              </Badge>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>{chapter.totalLectures} lectures</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{targetHours.toFixed(1)}h</span>
          </div>
        </div>

        {/* Timer Controls */}
        <div className="flex items-center gap-2 pt-2 border-t border-border/50">
          {!isCurrentlyWorking ? (
            <Button
              size="sm"
              variant="outline"
              className="flex-1 gap-2"
              onClick={(e) => handleTimerAction(e, () => onStartWorking?.())}
            >
              <Play className="h-3.5 w-3.5" />
              Start Working
            </Button>
          ) : (
            <>
              {isPaused ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={(e) => handleTimerAction(e, () => onResumeWorking?.())}
                >
                  <Play className="h-3.5 w-3.5" />
                  Resume
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={(e) => handleTimerAction(e, () => onPauseWorking?.())}
                >
                  <Pause className="h-3.5 w-3.5" />
                  Pause
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                className="flex-1 gap-2 hover:bg-destructive/20 hover:text-destructive hover:border-destructive/30"
                onClick={(e) => handleTimerAction(e, () => onStopWorking?.())}
              >
                <Square className="h-3.5 w-3.5" />
                Stop
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
