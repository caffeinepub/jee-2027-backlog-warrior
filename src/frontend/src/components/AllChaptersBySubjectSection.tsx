import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { useChapterData } from '../hooks/useChapterData';
import { useSubjects } from '../hooks/useSubjects';

export function AllChaptersBySubjectSection() {
  const { chapters } = useChapterData();
  const { subjects } = useSubjects();

  return (
    <div className="space-y-4">
      {subjects.map((subject) => {
        const subjectChapters = chapters.filter(ch => ch.subjectId === subject.id);
        const completedChapters = subjectChapters.filter(ch => ch.status === 'Completed');
        const incompleteChapters = subjectChapters.filter(ch => ch.status === 'Incomplete');
        const toughChapters = subjectChapters.filter(ch => ch.status === 'Tough');
        const notStartedChapters = subjectChapters.filter(ch => ch.status === 'Not Started');

        if (subjectChapters.length === 0) return null;

        return (
          <Card key={subject.id} className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-smooth">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{subject.name}</CardTitle>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                  {completedChapters.length}/{subjectChapters.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Completed Chapters */}
              {completedChapters.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-success flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Completed ({completedChapters.length})
                  </p>
                  <div className="space-y-1 pl-6">
                    {completedChapters.map(ch => (
                      <div key={ch.id} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-3 w-3 text-success shrink-0" />
                        <span className="text-foreground">{ch.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Incomplete Chapters */}
              {incompleteChapters.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-warning flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Incomplete ({incompleteChapters.length})
                  </p>
                  <div className="space-y-1 pl-6">
                    {incompleteChapters.map(ch => (
                      <div key={ch.id} className="flex items-center gap-2 text-sm">
                        <AlertCircle className="h-3 w-3 text-warning shrink-0" />
                        <span className="text-foreground">{ch.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tough Chapters */}
              {toughChapters.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-destructive flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Tough ({toughChapters.length})
                  </p>
                  <div className="space-y-1 pl-6">
                    {toughChapters.map(ch => (
                      <div key={ch.id} className="flex items-center gap-2 text-sm">
                        <AlertCircle className="h-3 w-3 text-destructive shrink-0" />
                        <span className="text-foreground">{ch.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Not Started Chapters */}
              {notStartedChapters.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                    <Circle className="h-4 w-4" />
                    Not Started ({notStartedChapters.length})
                  </p>
                  <div className="space-y-1 pl-6">
                    {notStartedChapters.map(ch => (
                      <div key={ch.id} className="flex items-center gap-2 text-sm">
                        <Circle className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span className="text-foreground">{ch.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
