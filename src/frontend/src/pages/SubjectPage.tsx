import { useState, useEffect } from 'react';
import { ChapterCard } from '../components/ChapterCard';
import { ChapterDetailPanel } from '../components/ChapterDetailPanel';
import { TodoList } from '../components/TodoList';
import { ResourceSidebar } from '../components/ResourceSidebar';
import { AddChapterDialog } from '../components/AddChapterDialog';
import { useChapterData } from '../hooks/useChapterData';
import { useSubjects } from '../hooks/useSubjects';
import { useCurrentlyWorkingChapters } from '../hooks/useCurrentlyWorkingChapters';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { type Chapter } from '../data/chapters';

interface SubjectPageProps {
  subjectId: string;
}

export function SubjectPage({ subjectId }: SubjectPageProps) {
  const { chapters, addChapter } = useChapterData();
  const { getSubjectById } = useSubjects();
  const { startWorking, stopWorking, isWorking, getElapsedTime } = useCurrentlyWorkingChapters();
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [, setTick] = useState(0);
  
  const subject = getSubjectById(subjectId);
  const subjectChapters = chapters.filter(ch => ch.subjectId === subjectId);

  // Force re-render every second to update elapsed times
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!subject) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Subject Not Found</h2>
          <p className="text-muted-foreground">The requested subject could not be found.</p>
        </div>
      </div>
    );
  }

  const handleAddChapter = (name: string, totalLectures: number, lectureDuration: number) => {
    addChapter(subjectId, name, totalLectures, lectureDuration);
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold">{subject.name}</h2>
        <AddChapterDialog
          subjectId={subjectId}
          subjectName={subject.name}
          onAdd={handleAddChapter}
        />
      </div>
      
      <Tabs defaultValue="chapters" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chapters" className="text-xs sm:text-sm">Chapters</TabsTrigger>
          <TabsTrigger value="todos" className="text-xs sm:text-sm">To-Do</TabsTrigger>
          <TabsTrigger value="resources" className="text-xs sm:text-sm">Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chapters" className="space-y-4">
          {subjectChapters.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-lg">
              <p className="text-muted-foreground mb-4">No chapters yet. Add your first chapter!</p>
              <AddChapterDialog
                subjectId={subjectId}
                subjectName={subject.name}
                onAdd={handleAddChapter}
              />
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {subjectChapters.map(chapter => (
                <ChapterCard
                  key={chapter.id}
                  chapter={chapter}
                  onClick={() => setSelectedChapter(chapter)}
                  isCurrentlyWorking={isWorking(chapter.id)}
                  elapsedSeconds={getElapsedTime(chapter.id)}
                  onStartWorking={() => startWorking(chapter.id)}
                  onStopWorking={() => stopWorking(chapter.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="todos">
          <TodoList subjectId={subjectId} subjectName={subject.name} />
        </TabsContent>
        
        <TabsContent value="resources">
          <ResourceSidebar subjectId={subjectId} subjectName={subject.name} />
        </TabsContent>
      </Tabs>
      
      {selectedChapter && (
        <ChapterDetailPanel
          chapter={selectedChapter}
          open={!!selectedChapter}
          onOpenChange={(open) => !open && setSelectedChapter(null)}
        />
      )}
    </div>
  );
}
