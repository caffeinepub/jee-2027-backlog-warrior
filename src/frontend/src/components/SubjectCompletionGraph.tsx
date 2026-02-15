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
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      prevCompletionRef.current = currentCompleted;
    }
  }, [chapters, newlyCompleted]);

  if (chapters.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6 bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-smooth shadow-elevated">
      <CardHeader>
        <CardTitle className="text-lg bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
          Subject Completion
        </CardTitle>
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
          <div className="relative h-10 bg-muted/30 rounded-xl overflow-hidden border border-border/30">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-success via-primary to-success transition-all duration-1000 ease-out flex items-center justify-center animate-shimmer"
              style={{ 
                width: `${stats.completionPercentage}%`,
                backgroundSize: '200% 100%'
              }}
            >
              {stats.completionPercentage > 10 && (
                <span className="text-sm font-bold text-white drop-shadow-lg">
                  {Math.round(stats.completionPercentage)}%
                </span>
              )}
            </div>
            {stats.completionPercentage <= 10 && stats.completionPercentage > 0 && (
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
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
                        w-full aspect-square rounded-xl bg-gradient-to-br from-success to-primary
                        flex items-center justify-center shadow-glow-sm
                        transition-smooth hover:scale-110 hover:shadow-glow-md
                        ${isNewlyCompleted ? 'animate-fill-slow' : ''}
                      `}
                    >
                      <CheckCircle2 className="h-4 w-4 text-white drop-shadow-lg" />
                    </div>
                  ) : (
                    <div className="w-full aspect-square rounded-xl border-2 border-muted-foreground/20 flex items-center justify-center bg-muted/20 transition-smooth hover:border-primary/40 hover:bg-muted/30">
                      <Circle className="h-4 w-4 text-muted-foreground/40" />
                    </div>
                  )}
                  
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-popover/95 backdrop-blur-sm text-popover-foreground text-xs rounded-lg shadow-elevated opacity-0 group-hover:opacity-100 transition-smooth pointer-events-none whitespace-nowrap z-10 border border-border/50">
                    {chapter.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="flex justify-around pt-3 border-t border-border/50">
          <div className="text-center">
            <div className="text-2xl font-bold text-success drop-shadow-sm">{stats.completed}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-muted-foreground">{stats.notCompleted}</div>
            <div className="text-xs text-muted-foreground">Remaining</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary drop-shadow-sm">{Math.round(stats.completionPercentage)}%</div>
            <div className="text-xs text-muted-foreground">Complete</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
