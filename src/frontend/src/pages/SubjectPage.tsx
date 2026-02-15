import { useParams, useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ArrowLeft, BookOpen, Clock, Calendar, Edit2, Save, X } from 'lucide-react';
import { ChapterCard } from '../components/ChapterCard';
import { ChapterDetailPanel } from '../components/ChapterDetailPanel';
import { AddChapterDialog } from '../components/AddChapterDialog';
import { SubjectCompletionGraph } from '../components/SubjectCompletionGraph';
import { TodoList } from '../components/TodoList';
import { ResourceSidebar } from '../components/ResourceSidebar';
import { SubjectDeleteButton } from '../components/SubjectDeleteButton';
import { useChapterData } from '../hooks/useChapterData';
import { useSubjects } from '../hooks/useSubjects';
import { useSubjectDetails } from '../hooks/useSubjectDetails';
import { useCurrentlyWorkingChapters } from '../hooks/useCurrentlyWorkingChapters';
import { useCustomization } from '../customization/CustomizationProvider';
import { useState, useMemo } from 'react';
import { type Chapter } from '../data/chapters';
import { toast } from 'sonner';

export function SubjectPage() {
  const { subjectId } = useParams({ from: '/subject/$subjectId' });
  const navigate = useNavigate();
  const { chapters, deleteChapter, addChapter } = useChapterData();
  const { getSubjectById, deleteSubject } = useSubjects();
  const { getSubjectDetails, updateSubjectDetails } = useSubjectDetails();
  const { settings } = useCustomization();
  const {
    isWorking,
    isPaused,
    getElapsedTime,
    startWorking,
    pauseWorking,
    stopWorking,
    getWorkingEntries,
    addWorkingEntry,
    updateWorkingEntry,
    deleteWorkingEntry,
  } = useCurrentlyWorkingChapters();

  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [editLectures, setEditLectures] = useState('');
  const [editTargetHours, setEditTargetHours] = useState('');
  const [editFinishDate, setEditFinishDate] = useState('');

  const subject = getSubjectById(subjectId);
  const subjectDetails = getSubjectDetails(subjectId);

  const subjectChapters = useMemo(
    () => chapters.filter((ch) => ch.subjectId === subjectId),
    [chapters, subjectId]
  );

  const handleDeleteSubject = () => {
    const success = deleteSubject(subjectId);
    if (success) {
      navigate({ to: '/' });
    }
  };

  const handleDeleteChapter = (chapterId: string) => {
    deleteChapter(chapterId);
    if (selectedChapter?.id === chapterId) {
      setSelectedChapter(null);
    }
  };

  const handleAddChapter = (name: string, totalLectures: number, lectureDuration: number) => {
    const newChapter: Chapter = {
      id: `chapter-${Date.now()}`,
      name,
      subjectId,
      totalLectures,
      lectureDuration,
      status: 'Not Started',
    };
    addChapter(newChapter);
    toast.success(`Chapter "${name}" added successfully!`);
  };

  const handleStartEditingDetails = () => {
    setEditLectures(subjectDetails?.totalLectures?.toString() || '');
    setEditTargetHours(subjectDetails?.targetHours?.toString() || '');
    setEditFinishDate(subjectDetails?.finishDate || '');
    setIsEditingDetails(true);
  };

  const handleSaveDetails = () => {
    const lectures = editLectures.trim() ? parseInt(editLectures, 10) : undefined;
    const targetHours = editTargetHours.trim() ? parseFloat(editTargetHours) : undefined;
    const finishDate = editFinishDate.trim() || undefined;

    if (lectures !== undefined && (isNaN(lectures) || lectures <= 0)) {
      toast.error('Please enter a valid number of lectures');
      return;
    }
    if (targetHours !== undefined && (isNaN(targetHours) || targetHours <= 0)) {
      toast.error('Please enter a valid target hours');
      return;
    }

    updateSubjectDetails(subjectId, {
      totalLectures: lectures,
      targetHours,
      finishDate,
      finishDateOverride: !!finishDate,
    });

    setIsEditingDetails(false);
    toast.success('Subject details updated successfully!');
  };

  if (!subject) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-6">
        <p className="text-center text-muted-foreground">Subject not found</p>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header with decorative accent */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm border border-border/50 p-6 shadow-elevated animate-fade-in-up">
        <div 
          className="absolute top-0 right-0 w-1/3 h-full opacity-5 bg-no-repeat bg-right bg-contain pointer-events-none"
          style={{ backgroundImage: 'url(/assets/generated/study-illustration-line.dim_1200x400.png)' }}
        />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })} className="icon-animated">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold font-display bg-gradient-to-r from-primary to-accent-cyan bg-clip-text text-transparent">
                {subject.name}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {subjectChapters.length} chapters • {subjectChapters.filter(ch => ch.status === 'Completed').length} completed
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AddChapterDialog
              subjectId={subjectId}
              subjectName={subject.name}
              onAdd={handleAddChapter}
            />
            <SubjectDeleteButton
              subjectName={subject.name}
              onDelete={handleDeleteSubject}
            />
          </div>
        </div>
      </div>

      {/* Subject Details Card */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-smooth animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Subject Details</CardTitle>
            {!isEditingDetails ? (
              <Button size="sm" variant="ghost" onClick={handleStartEditingDetails} className="icon-animated">
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={handleSaveDetails} className="icon-animated">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setIsEditingDetails(false)} className="icon-animated">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditingDetails ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-lectures">Total Lectures</Label>
                <Input
                  id="edit-lectures"
                  type="number"
                  value={editLectures}
                  onChange={(e) => setEditLectures(e.target.value)}
                  placeholder="e.g., 50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-target-hours">Target Hours</Label>
                <Input
                  id="edit-target-hours"
                  type="number"
                  step="0.1"
                  value={editTargetHours}
                  onChange={(e) => setEditTargetHours(e.target.value)}
                  placeholder="e.g., 75.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-finish-date">Date to Finish</Label>
                <Input
                  id="edit-finish-date"
                  type="date"
                  value={editFinishDate}
                  onChange={(e) => setEditFinishDate(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-primary icon-animated" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Lectures</p>
                  <p className="text-lg font-semibold">
                    {subjectDetails?.totalLectures || 'Not set'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-accent-cyan icon-animated" />
                <div>
                  <p className="text-sm text-muted-foreground">Target Hours</p>
                  <p className="text-lg font-semibold">
                    {subjectDetails?.targetHours ? `${subjectDetails.targetHours}h` : 'Not set'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-success icon-animated" />
                <div>
                  <p className="text-sm text-muted-foreground">Date to Finish</p>
                  <p className="text-lg font-semibold">
                    {subjectDetails?.finishDate 
                      ? new Date(subjectDetails.finishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : 'Not set'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completion Graph */}
      <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <SubjectCompletionGraph subjectId={subjectId} chapters={subjectChapters} />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="chapters" className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chapters">Chapters</TabsTrigger>
          <TabsTrigger value="todos">To-Do</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="chapters" className="space-y-4 mt-6">
          {subjectChapters.length === 0 ? (
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No chapters yet. Add your first chapter to get started!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjectChapters.map((chapter, idx) => {
                const chapterIsWorking = isWorking(chapter.id);
                const chapterIsPaused = isPaused(chapter.id);
                const elapsedSeconds = getElapsedTime(chapter.id);
                const workingEntries = getWorkingEntries(chapter.id);

                return (
                  <div key={chapter.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
                    <ChapterCard
                      chapter={chapter}
                      onClick={() => setSelectedChapter(chapter)}
                      isCurrentlyWorking={chapterIsWorking}
                      isPaused={chapterIsPaused}
                      elapsedSeconds={elapsedSeconds}
                      onStartWorking={() => startWorking(chapter.id)}
                      onPauseWorking={() => pauseWorking(chapter.id)}
                      onStopWorking={() => stopWorking(chapter.id)}
                      workingEntries={workingEntries}
                      onAddEntry={(duration) => addWorkingEntry(chapter.id, duration)}
                      onUpdateEntry={(entryId, duration) => updateWorkingEntry(chapter.id, entryId, duration)}
                      onDeleteEntry={(entryId) => deleteWorkingEntry(chapter.id, entryId)}
                      onDelete={() => handleDeleteChapter(chapter.id)}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="todos" className="mt-6">
          <TodoList subjectId={subjectId} subjectName={subject.name} />
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <ResourceSidebar subjectId={subjectId} subjectName={subject.name} />
        </TabsContent>
      </Tabs>

      {/* Chapter Detail Panel */}
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
