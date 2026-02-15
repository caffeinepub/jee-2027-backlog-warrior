import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Button } from '../components/ui/button';
import { Calendar, Clock, TrendingUp, Plus, Timer, Square, Edit2, Check, X } from 'lucide-react';
import { useChapterData } from '../hooks/useChapterData';
import { useStudyLog } from '../hooks/useStudyLog';
import { useSubjects } from '../hooks/useSubjects';
import { useCurrentlyWorkingChapters } from '../hooks/useCurrentlyWorkingChapters';
import { useDashboardNote } from '../hooks/useDashboardNote';
import { useDashboardTitle } from '../hooks/useDashboardTitle';
import { useMemo, useState, useEffect } from 'react';
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
  const { getActiveChapters, stopWorking } = useCurrentlyWorkingChapters();
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

  const stats = useMemo(() => {
    const total = chapters.length;
    const completed = chapters.filter(ch => ch.status === 'Completed').length;
    const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    const targetDate = new Date('2026-07-31T23:59:59');
    const today = new Date();
    const daysRemaining = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    // Calculate time remaining for live countdown
    const timeRemaining = targetDate.getTime() - currentTime.getTime();
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    
    // Calculate tomorrow's date
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDayName = tomorrow.toLocaleDateString('en-US', { weekday: 'long' });
    const tomorrowDate = tomorrow.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    
    const todayHours = getTodayHours();
    
    return { 
      completionPercentage, 
      daysRemaining, 
      todayHours, 
      completed, 
      total,
      countdown: { days, hours, minutes, seconds },
      tomorrow: { dayName: tomorrowDayName, date: tomorrowDate }
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

  const handleAddSubject = (e: React.FormEvent) => {
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
  };

  const handleSaveTitle = () => {
    if (editedTitle.trim()) {
      setTitle(editedTitle.trim());
      setIsEditingTitle(false);
    } else {
      setEditedTitle(title);
      setIsEditingTitle(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedTitle(title);
    setIsEditingTitle(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

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
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-5xl sm:text-6xl font-bold text-primary mb-2">{stats.daysRemaining}</div>
            <p className="text-sm sm:text-base text-muted-foreground">Until July 31, 2026</p>
          </div>
          
          {/* Live Countdown Timer */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Timer className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Live Countdown</span>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary">{stats.countdown.days}</div>
                <div className="text-xs text-muted-foreground">Days</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary">{stats.countdown.hours}</div>
                <div className="text-xs text-muted-foreground">Hours</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary">{stats.countdown.minutes}</div>
                <div className="text-xs text-muted-foreground">Minutes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary">{stats.countdown.seconds}</div>
                <div className="text-xs text-muted-foreground">Seconds</div>
              </div>
            </div>
          </div>

          {/* Tomorrow's Date */}
          <div className="border-t border-border pt-4">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground mb-1">Tomorrow</p>
              <p className="text-lg font-semibold">{stats.tomorrow.dayName}</p>
              <p className="text-sm text-muted-foreground">{stats.tomorrow.date}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Currently Working Section */}
      {activeChaptersWithNames.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Clock className="h-5 w-5 text-primary" />
              Currently Working
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeChaptersWithNames.map(ac => (
                <div
                  key={ac.chapterId}
                  className="flex items-center justify-between p-3 border border-border rounded-lg bg-primary/5"
                >
                  <div className="flex-1">
                    <p className="font-medium">{ac.chapterName}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatElapsedTime(ac.elapsedSeconds)}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => stopWorking(ac.chapterId)}
                  >
                    <Square className="h-3 w-3 mr-2" />
                    Stop
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Ring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <TrendingUp className="h-5 w-5" />
            Overall Syllabus Completion
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="relative w-40 h-40 sm:w-48 sm:h-48">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="40%"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-muted/20"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="40%"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - stats.completionPercentage / 100)}`}
                  className="text-primary transition-all duration-500"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl sm:text-4xl font-bold">{stats.completionPercentage}%</span>
                <span className="text-xs sm:text-sm text-muted-foreground">{stats.completed}/{stats.total} chapters</span>
              </div>
            </div>
          </div>
          <Progress value={stats.completionPercentage} className="h-2" />
        </CardContent>
      </Card>

      {/* Daily Grind */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Clock className="h-5 w-5" />
            Daily Grind
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <div className="text-4xl sm:text-5xl font-bold text-primary">{stats.todayHours.toFixed(1)}</div>
            <p className="text-sm sm:text-base text-muted-foreground">Hours studied today</p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Add Subject */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Plus className="h-5 w-5" />
            Quick Add Subject
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddSubject} className="flex gap-2">
            <Input
              placeholder="Enter subject name..."
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
            />
            <Button type="submit">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2">
            You have {subjects.length} subject{subjects.length !== 1 ? 's' : ''} in total
          </p>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => navigate({ to: '/customize' })}
        >
          Manage Subjects & Settings
        </Button>
      </div>
    </div>
  );
}
