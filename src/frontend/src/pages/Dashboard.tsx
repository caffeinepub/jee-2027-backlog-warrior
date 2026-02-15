import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { BookOpen, Clock, Target, TrendingUp, Edit2, Save, X } from 'lucide-react';
import { useChapterData } from '../hooks/useChapterData';
import { useSubjects } from '../hooks/useSubjects';
import { useDashboardNote } from '../hooks/useDashboardNote';
import { useDashboardTitle } from '../hooks/useDashboardTitle';
import { useCurrentlyWorkingChapters } from '../hooks/useCurrentlyWorkingChapters';
import { useCustomization } from '../customization/CustomizationProvider';
import { useState, useEffect, useMemo } from 'react';
import { NotificationsSection } from '../components/NotificationsSection';
import { DashboardCompletionDistributionChart } from '../components/DashboardCompletionDistributionChart';

export function Dashboard() {
  const navigate = useNavigate();
  const { chapters } = useChapterData();
  const { subjects } = useSubjects();
  const { note, setNote } = useDashboardNote();
  const { title, setTitle } = useDashboardTitle();
  const { getActiveChapters } = useCurrentlyWorkingChapters();
  const { settings } = useCustomization();
  
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitleValue, setEditTitleValue] = useState(title);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [editNoteValue, setEditNoteValue] = useState(note);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const currentlyWorking = useMemo(() => {
    const activeChapters = getActiveChapters();
    return activeChapters.map(active => {
      const chapter = chapters.find(ch => ch.id === active.chapterId);
      const subject = chapter ? subjects.find(s => s.id === chapter.subjectId) : undefined;
      return {
        chapterId: active.chapterId,
        chapterName: chapter?.name || 'Unknown Chapter',
        subjectName: subject?.name || 'Unknown Subject',
        isPaused: active.isPaused,
      };
    });
  }, [getActiveChapters, chapters, subjects]);

  const stats = useMemo(() => {
    const totalChapters = chapters.length;
    const completedChapters = chapters.filter(ch => ch.status === 'Completed').length;
    const inProgressChapters = chapters.filter(ch => ch.status === 'Incomplete' || ch.status === 'Tough').length;
    const completionPercentage = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

    const totalTargetHours = chapters.reduce((sum, ch) => {
      const computedHours = (ch.totalLectures * ch.lectureDuration) / (settings.lectureSpeedFactor * 60);
      return sum + (ch.targetHoursOverride ?? computedHours);
    }, 0);

    return {
      totalChapters,
      completedChapters,
      inProgressChapters,
      completionPercentage,
      totalTargetHours,
    };
  }, [chapters, settings.lectureSpeedFactor]);

  const handleSaveTitle = () => {
    setTitle(editTitleValue);
    setIsEditingTitle(false);
  };

  const handleSaveNote = () => {
    setNote(editNoteValue);
    setIsEditingNote(false);
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Hero Section with decorative illustration */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm border border-border/50 p-8 animate-fade-in-up shadow-elevated">
        <div 
          className="absolute top-0 right-0 w-1/2 h-full opacity-10 bg-no-repeat bg-right bg-contain pointer-events-none"
          style={{ backgroundImage: 'url(/assets/generated/study-illustration-line.dim_1200x400.png)' }}
        />
        <div className="relative z-10">
          {isEditingTitle ? (
            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                value={editTitleValue}
                onChange={(e) => setEditTitleValue(e.target.value)}
                className="text-4xl font-bold font-display bg-transparent border-b-2 border-primary focus:outline-none flex-1"
                autoFocus
              />
              <Button size="icon" variant="ghost" onClick={handleSaveTitle} className="icon-animated">
                <Save className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => setIsEditingTitle(false)} className="icon-animated">
                <X className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-4xl font-bold font-display bg-gradient-to-r from-primary via-accent-cyan to-accent-lime bg-clip-text text-transparent">
                {title}
              </h1>
              <Button size="icon" variant="ghost" onClick={() => setIsEditingTitle(true)} className="icon-animated">
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          )}
          <p className="text-muted-foreground text-lg">
            {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-smooth hover-lift animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Chapters</CardTitle>
            <BookOpen className="h-5 w-5 text-primary icon-animated" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalChapters}</div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-success/30 transition-smooth hover-lift animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            <Target className="h-5 w-5 text-success icon-animated" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">{stats.completedChapters}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.completionPercentage.toFixed(1)}% complete
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-warning/30 transition-smooth hover-lift animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
            <TrendingUp className="h-5 w-5 text-warning icon-animated" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">{stats.inProgressChapters}</div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-accent-cyan/30 transition-smooth hover-lift animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Target Hours</CardTitle>
            <Clock className="h-5 w-5 text-accent-cyan icon-animated" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent-cyan">{stats.totalTargetHours.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total study time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Notifications Section */}
      <NotificationsSection />

      {/* Completion Distribution Chart */}
      <DashboardCompletionDistributionChart />

      {/* Currently Working Section */}
      {currentlyWorking.length > 0 && (
        <Card className="bg-card/80 backdrop-blur-sm border-border/50 animate-fade-in-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Currently Working
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentlyWorking.map((item) => (
                <div
                  key={item.chapterId}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-smooth"
                >
                  <div>
                    <p className="font-medium">{item.chapterName}</p>
                    <p className="text-sm text-muted-foreground">{item.subjectName}</p>
                  </div>
                  {item.isPaused && (
                    <Badge variant="outline" className="text-warning border-warning">
                      Paused
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Note Section */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50 animate-fade-in-up">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Quick Note</CardTitle>
            {!isEditingNote ? (
              <Button size="icon" variant="ghost" onClick={() => { setEditNoteValue(note); setIsEditingNote(true); }} className="icon-animated">
                <Edit2 className="h-4 w-4" />
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" onClick={handleSaveNote} className="icon-animated">
                  <Save className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => setIsEditingNote(false)} className="icon-animated">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditingNote ? (
            <Textarea
              value={editNoteValue}
              onChange={(e) => setEditNoteValue(e.target.value)}
              placeholder="Jot down quick thoughts..."
              className="min-h-[120px] resize-none"
              autoFocus
            />
          ) : (
            <p className="text-muted-foreground whitespace-pre-wrap min-h-[120px]">
              {note || 'Click edit to add a quick note...'}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Subject Quick Access */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50 animate-fade-in-up">
        <CardHeader>
          <CardTitle>Subject Quick Access</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {subjects.map((subject) => {
              const subjectChapters = chapters.filter(ch => ch.subjectId === subject.id);
              const completedCount = subjectChapters.filter(ch => ch.status === 'Completed').length;
              const totalCount = subjectChapters.length;
              
              return (
                <Button
                  key={subject.id}
                  variant="outline"
                  className="h-auto flex-col items-start p-4 hover:border-primary/50 transition-smooth hover-lift"
                  onClick={() => navigate({ to: '/subject/$subjectId', params: { subjectId: subject.id } })}
                >
                  <div className="font-semibold text-left w-full">{subject.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {completedCount}/{totalCount} chapters
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
