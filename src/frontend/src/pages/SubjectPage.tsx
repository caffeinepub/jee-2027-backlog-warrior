import { useState, useEffect, useMemo } from 'react';
import { ChapterCard } from '../components/ChapterCard';
import { ChapterDetailPanel } from '../components/ChapterDetailPanel';
import { TodoList } from '../components/TodoList';
import { ResourceSidebar } from '../components/ResourceSidebar';
import { AddChapterDialog } from '../components/AddChapterDialog';
import { SubjectCompletionGraph } from '../components/SubjectCompletionGraph';
import { useChapterData } from '../hooks/useChapterData';
import { useSubjects } from '../hooks/useSubjects';
import { useCurrentlyWorkingChapters } from '../hooks/useCurrentlyWorkingChapters';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

interface SubjectPageProps {
  subjectId: string;
}

export function SubjectPage({ subjectId }: SubjectPageProps) {
  const { chapters, addChapter } = useChapterData();
  const { getSubjectById } = useSubjects();
  const {
    startWorking,
    pauseWorking,
    stopWorking,
    isWorking,
    isPaused,
    getElapsedTime,
    getWorkingEntries,
    addWorkingEntry,
    updateWorkingEntry,
    deleteWorkingEntry,
  } = useCurrentlyWorkingChapters();
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  
  const subject = getSubjectById(subjectId);
  const subjectChapters = useMemo(
    () => chapters.filter(ch => ch.subjectId === subjectId),
    [chapters, subjectId]
  );
  const selectedChapter = useMemo(
    () => selectedChapterId ? chapters.find(ch => ch.id === selectedChapterId) || null : null,
    [selectedChapterId, chapters]
  );

  // Force re-render every second to update elapsed times
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAddChapter = (name: string, totalLectures: number, lectureDuration: number) => {
    addChapter(subjectId, name, totalLectures, lectureDuration);
  };

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
          {subjectChapters.length > 0 && (
            <SubjectCompletionGraph
              subjectId={subjectId}
              chapters={subjectChapters}
            />
          )}
          
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
                  onClick={() => setSelectedChapterId(chapter.id)}
                  isCurrentlyWorking={isWorking(chapter.id)}
                  isPaused={isPaused(chapter.id)}
                  elapsedSeconds={getElapsedTime(chapter.id)}
                  onStartWorking={() => startWorking(chapter.id)}
                  onPauseWorking={() => pauseWorking(chapter.id)}
                  onStopWorking={() => stopWorking(chapter.id)}
                  workingEntries={getWorkingEntries(chapter.id)}
                  onAddEntry={(duration) => addWorkingEntry(chapter.id, duration)}
                  onUpdateEntry={(entryId, duration) => updateWorkingEntry(chapter.id, entryId, duration)}
                  onDeleteEntry={(entryId) => deleteWorkingEntry(chapter.id, entryId)}
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
          onOpenChange={(open) => !open && setSelectedChapterId(null)}
        />
      )}
    </div>
  );
}
