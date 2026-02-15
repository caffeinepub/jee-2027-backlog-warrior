import { useMemo, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CheckCircle2, Circle } from 'lucide-react';
import { type Chapter } from '../data/chapters';

interface SubjectCompletionGraphProps {
  subjectId: string;
  chapters: Chapter[];
}

export function SubjectCompletionGraph({ subjectId, chapters }: SubjectCompletionGraphProps) {
  const prevCompletionRef = useRef<Set<string>>(new Set());

  const stats = useMemo(() => {
    const total = chapters.length;
    const completed = chapters.filter(ch => ch.status === 'Completed').length;
    const completionPercentage = total > 0 ? (completed / total) * 100 : 0;
    
    return {
      total,
      completed,
      completionPercentage,
      notCompleted: total - completed,
    };
  }, [chapters]);

  // Track newly completed chapters for animation
  const newlyCompleted = useMemo(() => {
    const currentCompleted = new Set(
      chapters.filter(ch => ch.status === 'Completed').map(ch => ch.id)
    );
    const newly = new Set<string>();
    
    currentCompleted.forEach(id => {
      if (!prevCompletionRef.current.has(id)) {
        newly.add(id);
      }
    });
    
    return newly;
  }, [chapters]);

  // Update previous completion state after render
  useEffect(() => {
    const currentCompleted = new Set(
      chapters.filter(ch => ch.status === 'Completed').map(ch => ch.id)
    );
    
    // Clear newly completed after animation duration
    if (newlyCompleted.size > 0) {
      const timer = setTimeout(() => {
        prevCompletionRef.current = currentCompleted;
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      prevCompletionRef.current = currentCompleted;
    }
  }, [chapters, newlyCompleted]);

  if (chapters.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Subject Completion</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold">
              {stats.completed} / {stats.total} chapters
            </span>
          </div>
          <div className="relative h-8 bg-muted rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-green-600 transition-all duration-1000 ease-out flex items-center justify-center"
              style={{ width: `${stats.completionPercentage}%` }}
            >
              {stats.completionPercentage > 10 && (
                <span className="text-xs font-bold text-white">
                  {Math.round(stats.completionPercentage)}%
                </span>
              )}
            </div>
            {stats.completionPercentage <= 10 && stats.completionPercentage > 0 && (
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                {Math.round(stats.completionPercentage)}%
              </span>
            )}
          </div>
        </div>

        {/* Chapter-by-Chapter Grid */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Chapters</p>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {chapters.map((chapter) => {
              const isCompleted = chapter.status === 'Completed';
              const isNewlyCompleted = newlyCompleted.has(chapter.id);
              
              return (
                <div
                  key={chapter.id}
                  className="relative group"
                  title={`${chapter.name} - ${chapter.status}`}
                >
                  {isCompleted ? (
                    <div
                      className={`
                        w-full aspect-square rounded-lg bg-gradient-to-br from-green-500 to-green-600 
                        flex items-center justify-center shadow-sm
                        ${isNewlyCompleted ? 'animate-fill-slow' : ''}
                      `}
                    >
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-full aspect-square rounded-lg border-2 border-muted-foreground/30 flex items-center justify-center bg-muted/30">
                      <Circle className="h-4 w-4 text-muted-foreground/50" />
                    </div>
                  )}
                  
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {chapter.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="flex justify-around pt-2 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-muted-foreground">{stats.notCompleted}</div>
            <div className="text-xs text-muted-foreground">Remaining</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{Math.round(stats.completionPercentage)}%</div>
            <div className="text-xs text-muted-foreground">Complete</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
