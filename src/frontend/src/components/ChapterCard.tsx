import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { type Chapter } from '../data/chapters';
import { useCustomization } from '../customization/CustomizationProvider';
import { Clock, BookOpen, Play, Square } from 'lucide-react';

interface ChapterCardProps {
  chapter: Chapter;
  onClick: () => void;
  isCurrentlyWorking?: boolean;
  elapsedSeconds?: number;
  onStartWorking?: () => void;
  onStopWorking?: () => void;
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

export function ChapterCard({ 
  chapter, 
  onClick, 
  isCurrentlyWorking = false,
  elapsedSeconds = 0,
  onStartWorking,
  onStopWorking,
}: ChapterCardProps) {
  const { settings, draftSettings } = useCustomization();
  const activeSettings = draftSettings || settings;
  const isCompact = activeSettings.chapterCardSize === 'compact';
  
  const statusColors = {
    'Not Started': 'bg-muted text-muted-foreground',
    'Incomplete': 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    'Tough': 'bg-destructive/10 text-destructive',
    'Completed': 'bg-green-500/10 text-green-600 dark:text-green-400',
  };

  const targetHours = (chapter.totalLectures * chapter.lectureDuration) / (activeSettings.lectureSpeedFactor * 60);

  const handleWorkingToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentlyWorking) {
      onStopWorking?.();
    } else {
      onStartWorking?.();
    }
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all hover:border-primary/50"
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
          <Badge className="bg-primary/10 text-primary border-primary/20 mt-2 w-fit">
            <Clock className="h-3 w-3 mr-1" />
            {formatElapsedTime(elapsedSeconds)}
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
            <span>{targetHours.toFixed(1)} hours target</span>
          </div>
        )}
        {onStartWorking && onStopWorking && (
          <Button
            variant={isCurrentlyWorking ? "destructive" : "outline"}
            size="sm"
            className="w-full mt-2"
            onClick={handleWorkingToggle}
          >
            {isCurrentlyWorking ? (
              <>
                <Square className="h-3 w-3 mr-2" />
                Stop Working
              </>
            ) : (
              <>
                <Play className="h-3 w-3 mr-2" />
                Currently Working
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
