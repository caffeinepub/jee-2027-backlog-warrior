import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { BookOpen, CheckCircle2, Circle } from 'lucide-react';
import { useChapterData } from '../hooks/useChapterData';
import { useSubjects } from '../hooks/useSubjects';
import { useMemo } from 'react';

export function AllChaptersBySubjectSection() {
  const { chapters } = useChapterData();
  const { subjects } = useSubjects();

  // Group chapters by subject
  const chaptersBySubject = useMemo(() => {
    const grouped = new Map<string, { subjectName: string; chapters: Array<{ id: string; name: string; status: string }> }>();

    subjects.forEach(subject => {
      const subjectChapters = chapters
        .filter(ch => ch.subjectId === subject.id)
        .map(ch => ({
          id: ch.id,
          name: ch.name,
          status: ch.status,
        }));

      if (subjectChapters.length > 0) {
        grouped.set(subject.id, {
          subjectName: subject.name,
          chapters: subjectChapters,
        });
      }
    });

    return grouped;
  }, [chapters, subjects]);

  // If no chapters exist at all
  if (chapters.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            All Chapters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No chapters available. Add chapters to your subjects to see them here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          All Chapters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Array.from(chaptersBySubject.entries()).map(([subjectId, { subjectName, chapters: subjectChapters }]) => (
          <div key={subjectId} className="space-y-3">
            <h3 className="font-semibold text-lg border-b pb-2">{subjectName}</h3>
            <div className="space-y-2">
              {subjectChapters.map(chapter => {
                const isCompleted = chapter.status === 'Completed';
                return (
                  <div
                    key={chapter.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className={isCompleted ? 'text-green-600 dark:text-green-400 font-medium' : ''}>
                        {chapter.name}
                      </span>
                    </div>
                    <Badge variant={isCompleted ? 'default' : 'secondary'} className={isCompleted ? 'bg-green-600 hover:bg-green-700' : ''}>
                      {isCompleted ? 'Completed' : 'Not Completed'}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
