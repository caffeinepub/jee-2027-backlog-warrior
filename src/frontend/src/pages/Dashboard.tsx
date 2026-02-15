import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Button } from '../components/ui/button';
import { Calendar, Clock, TrendingUp, Plus, Timer, Square, Edit2, Check, X, Pause, Play } from 'lucide-react';
import { useChapterData } from '../hooks/useChapterData';
import { useStudyLog } from '../hooks/useStudyLog';
import { useSubjects } from '../hooks/useSubjects';
import { useCurrentlyWorkingChapters } from '../hooks/useCurrentlyWorkingChapters';
import { useDashboardNote } from '../hooks/useDashboardNote';
import { useDashboardTitle } from '../hooks/useDashboardTitle';
import { AllChaptersBySubjectSection } from '../components/AllChaptersBySubjectSection';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';

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

export function Dashboard() {
  const navigate = useNavigate();
  const { chapters } = useChapterData();
  const { getTodayHours } = useStudyLog();
  const { subjects, addSubject } = useSubjects();
  const { getActiveChapters, stopWorking, pauseWorking, startWorking } = useCurrentlyWorkingChapters();
  const { note, setNote } = useDashboardNote();
  const { title, setTitle } = useDashboardTitle();
  const [newSubjectName, setNewSubjectName] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  // Update time every second for live countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync editedTitle when title changes externally
  useEffect(() => {
    setEditedTitle(title);
  }, [title]);

  const stats = useMemo(() => {
    const total = chapters.length;
    const completed = chapters.filter(ch => ch.status === 'Completed').length;
    const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    const targetDate = new Date('2026-07-31T23:59:59');
    const today = new Date();
    const daysRemaining = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    // Calculate time remaining for live countdown to July 31, 2026
    const timeRemaining = targetDate.getTime() - currentTime.getTime();
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    
    // Calculate today's day name and date
    const todayDayName = currentTime.toLocaleDateString('en-US', { weekday: 'long' });
    const todayDate = currentTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    
    // Calculate time remaining until midnight (daily timer)
    const midnight = new Date(currentTime);
    midnight.setHours(24, 0, 0, 0);
    const timeUntilMidnight = midnight.getTime() - currentTime.getTime();
    const dailyHours = Math.floor(timeUntilMidnight / (1000 * 60 * 60));
    const dailyMinutes = Math.floor((timeUntilMidnight % (1000 * 60 * 60)) / (1000 * 60));
    const dailySeconds = Math.floor((timeUntilMidnight % (1000 * 60)) / 1000);
    
    const todayHours = getTodayHours();
    
    return { 
      completionPercentage, 
      daysRemaining, 
      todayHours, 
      completed, 
      total,
      countdown: { days, hours, minutes, seconds },
      today: { dayName: todayDayName, date: todayDate },
      dailyTimer: { hours: dailyHours, minutes: dailyMinutes, seconds: dailySeconds }
    };
  }, [chapters, getTodayHours, currentTime]);

  const activeChapters = getActiveChapters();
  const activeChaptersWithNames = useMemo(() => {
    return activeChapters.map(ac => {
      const chapter = chapters.find(ch => ch.id === ac.chapterId);
      return {
        ...ac,
        chapterName: chapter?.name || 'Unknown Chapter',
      };
    });
  }, [activeChapters, chapters]);

  const handleAddSubject = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (newSubjectName.trim()) {
      const success = addSubject(newSubjectName.trim());
      if (success) {
        toast.success(`Subject "${newSubjectName.trim()}" added successfully!`);
        setNewSubjectName('');
      } else {
        toast.error('Failed to add subject. It may already exist.');
      }
    }
  }, [newSubjectName, addSubject]);

  const handleSaveTitle = useCallback(() => {
    if (editedTitle.trim()) {
      setTitle(editedTitle.trim());
      setIsEditingTitle(false);
    } else {
      setEditedTitle(title);
      setIsEditingTitle(false);
    }
  }, [editedTitle, title, setTitle]);

  const handleCancelEdit = useCallback(() => {
    setEditedTitle(title);
    setIsEditingTitle(false);
  }, [title]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  }, [handleSaveTitle, handleCancelEdit]);

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        {isEditingTitle ? (
          <div className="flex items-center justify-center gap-2">
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              className="text-3xl sm:text-4xl font-bold text-center max-w-md"
              autoFocus
            />
            <Button size="icon" variant="ghost" onClick={handleSaveTitle}>
              <Check className="h-5 w-5 text-green-600" />
            </Button>
            <Button size="icon" variant="ghost" onClick={handleCancelEdit}>
              <X className="h-5 w-5 text-red-600" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 group">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{title}</h2>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsEditingTitle(true)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit2 className="h-5 w-5" />
            </Button>
          </div>
        )}
        <Textarea
          placeholder="Add your personal note here..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="text-center resize-none min-h-[60px] text-base sm:text-lg"
        />
      </section>

      {/* Days Remaining Card with Live Countdown */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
            <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            Days Remaining
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-5xl sm:text-6xl font-bold text-primary mb-2">{stats.daysRemaining}</div>
            <p className="text-sm sm:text-base text-muted-foreground">Until July 31, 2026</p>
          </div>
          
          {/* Live Countdown to July 31, 2026 */}
          <div>
            <p className="text-xs text-muted-foreground text-center mb-2">Time Remaining Until Exam</p>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-muted/50 rounded-lg p-2">
                <div className="text-xl sm:text-2xl font-bold">{stats.countdown.days}</div>
                <div className="text-xs text-muted-foreground">Days</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-2">
                <div className="text-xl sm:text-2xl font-bold">{stats.countdown.hours}</div>
                <div className="text-xs text-muted-foreground">Hours</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-2">
                <div className="text-xl sm:text-2xl font-bold">{stats.countdown.minutes}</div>
                <div className="text-xs text-muted-foreground">Mins</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-2">
                <div className="text-xl sm:text-2xl font-bold">{stats.countdown.seconds}</div>
                <div className="text-xs text-muted-foreground">Secs</div>
              </div>
            </div>
          </div>

          {/* Today's Date */}
          <div className="text-center pt-2 border-t">
            <p className="text-sm text-muted-foreground">Today</p>
            <p className="text-base font-semibold">{stats.today.dayName}</p>
            <p className="text-xs text-muted-foreground">{stats.today.date}</p>
          </div>

          {/* Daily 24-Hour Timer */}
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground text-center mb-2">Time Remaining Today</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-muted/50 rounded-lg p-2">
                <div className="text-xl sm:text-2xl font-bold">{String(stats.dailyTimer.hours).padStart(2, '0')}</div>
                <div className="text-xs text-muted-foreground">Hours</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-2">
                <div className="text-xl sm:text-2xl font-bold">{String(stats.dailyTimer.minutes).padStart(2, '0')}</div>
                <div className="text-xs text-muted-foreground">Minutes</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-2">
                <div className="text-xl sm:text-2xl font-bold">{String(stats.dailyTimer.seconds).padStart(2, '0')}</div>
                <div className="text-xs text-muted-foreground">Seconds</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Currently Working Section */}
      {activeChaptersWithNames.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-primary" />
              Currently Working
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeChaptersWithNames.map((ac) => (
              <div
                key={ac.chapterId}
                className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/30"
              >
                <div className="flex-1">
                  <p className="font-medium">{ac.chapterName}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatElapsedTime(ac.elapsedSeconds)}
                    {ac.isPaused && <span className="ml-2 text-yellow-600">(Paused)</span>}
                  </p>
                </div>
                <div className="flex gap-2">
                  {ac.isPaused ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startWorking(ac.chapterId)}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => pauseWorking(ac.chapterId)}
                    >
                      <Pause className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => stopWorking(ac.chapterId)}
                  >
                    <Square className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Completion Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Chapters Completed</span>
              <span className="font-semibold">{stats.completed} / {stats.total}</span>
            </div>
            <Progress value={stats.completionPercentage} className="h-3" />
            <p className="text-center text-2xl font-bold text-primary">{stats.completionPercentage}%</p>
          </div>
        </CardContent>
      </Card>

      {/* Daily Grind */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Daily Grind
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">{stats.todayHours.toFixed(1)}h</div>
            <p className="text-sm text-muted-foreground">Hours studied today</p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Add Subject */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Quick Add Subject
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddSubject} className="flex gap-2">
            <Input
              placeholder="Enter subject name..."
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Add</Button>
          </form>
        </CardContent>
      </Card>

      {/* All Chapters Section */}
      <AllChaptersBySubjectSection />
    </div>
  );
}
