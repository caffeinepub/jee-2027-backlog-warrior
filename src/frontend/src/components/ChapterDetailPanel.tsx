import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Check, X, Clock, BookOpen, Calendar, Edit2, Save } from 'lucide-react';
import { type Chapter } from '../data/chapters';
import { useChapterData } from '../hooks/useChapterData';
import { useCustomization } from '../customization/CustomizationProvider';
import { useSubjects } from '../hooks/useSubjects';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { useState } from 'react';
import { toast } from 'sonner';

interface ChapterDetailPanelProps {
  chapter: Chapter;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChapterDetailPanel({ chapter, open, onOpenChange }: ChapterDetailPanelProps) {
  const { updateChapterStatus, updateChapterFields } = useChapterData();
  const { settings, draftSettings } = useCustomization();
  const { getSubjectById } = useSubjects();
  const activeSettings = draftSettings || settings;
  
  const [isEditingLectures, setIsEditingLectures] = useState(false);
  const [editLecturesValue, setEditLecturesValue] = useState(chapter.totalLectures.toString());
  
  const [isEditingTargetHours, setIsEditingTargetHours] = useState(false);
  const [editTargetHoursValue, setEditTargetHoursValue] = useState(
    chapter.targetHoursOverride?.toString() || ''
  );
  
  const subject = getSubjectById(chapter.subjectId);
  
  const computedTargetHours = (chapter.totalLectures * chapter.lectureDuration) / (activeSettings.lectureSpeedFactor * 60);
  const effectiveTargetHours = chapter.targetHoursOverride !== undefined 
    ? chapter.targetHoursOverride 
    : computedTargetHours;
  
  const calculateDateToFinish = () => {
    if (!activeSettings.autoRecalculateDateToFinish) return null;
    
    const today = new Date();
    const daysNeeded = Math.ceil(effectiveTargetHours / activeSettings.dailyTargetHours);
    const finishDate = new Date(today);
    finishDate.setDate(finishDate.getDate() + daysNeeded);
    
    return finishDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleComplete = () => {
    if (chapter.status === 'Completed') {
      updateChapterStatus(chapter.id, 'Not Started');
      toast.success('Chapter status cleared');
    } else {
      updateChapterStatus(chapter.id, 'Completed');
      toast.success('Chapter marked as completed!');
    }
  };

  const handleIncomplete = () => {
    if (chapter.status === 'Incomplete') {
      updateChapterStatus(chapter.id, 'Not Started');
      toast.success('Chapter status cleared');
    } else {
      updateChapterStatus(chapter.id, 'Incomplete');
      toast.success('Chapter marked as incomplete');
    }
  };

  const handleTough = () => {
    if (chapter.status === 'Tough') {
      updateChapterStatus(chapter.id, 'Not Started');
      toast.success('Chapter status cleared');
    } else {
      updateChapterStatus(chapter.id, 'Tough');
      toast.success('Chapter marked as tough');
    }
  };

  const handleSaveLectures = () => {
    const value = parseInt(editLecturesValue, 10);
    if (isNaN(value) || value <= 0) {
      toast.error('Please enter a valid number of lectures');
      return;
    }
    updateChapterFields(chapter.id, { totalLectures: value });
    setIsEditingLectures(false);
    toast.success('Total lectures updated');
  };

  const handleSaveTargetHours = () => {
    const value = parseFloat(editTargetHoursValue);
    if (editTargetHoursValue.trim() === '') {
      updateChapterFields(chapter.id, { targetHoursOverride: undefined });
      setIsEditingTargetHours(false);
      toast.success('Target hours override cleared');
      return;
    }
    if (isNaN(value) || value <= 0) {
      toast.error('Please enter a valid target hours');
      return;
    }
    updateChapterFields(chapter.id, { targetHoursOverride: value });
    setIsEditingTargetHours(false);
    toast.success('Target hours override updated');
  };

  const statusColors = {
    'Not Started': 'bg-muted text-muted-foreground border-muted',
    'Incomplete': 'bg-warning/20 text-warning border-warning/30',
    'Tough': 'bg-destructive/20 text-destructive border-destructive/30',
    'Completed': 'bg-success/20 text-success border-success/30',
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto bg-card/95 backdrop-blur-xl border-l-2 border-primary/30 shadow-2xl pb-20">
        <div 
          className="absolute top-0 right-0 w-1/2 h-32 opacity-5 bg-no-repeat bg-right-top bg-contain pointer-events-none"
          style={{ backgroundImage: 'url(/assets/generated/study-illustration-line.dim_1200x400.png)' }}
        />
        <SheetHeader className="relative z-10">
          <SheetTitle className="text-2xl font-bold">{chapter.name}</SheetTitle>
          <SheetDescription className="flex items-center gap-2 mt-2">
            <Badge className={`${statusColors[chapter.status]} transition-smooth`} variant="outline">
              {chapter.status}
            </Badge>
            {subject && (
              <span className="text-sm text-muted-foreground">• {subject.name}</span>
            )}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Total Lectures */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary icon-animated" />
                <span className="font-semibold">Total Lectures</span>
              </div>
              {!isEditingLectures ? (
                <Button size="sm" variant="ghost" onClick={() => { setIsEditingLectures(true); setEditLecturesValue(chapter.totalLectures.toString()); }} className="icon-animated">
                  <Edit2 className="h-4 w-4" />
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={handleSaveLectures} className="icon-animated">
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setIsEditingLectures(false)} className="icon-animated">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            {isEditingLectures ? (
              <Input
                type="number"
                value={editLecturesValue}
                onChange={(e) => setEditLecturesValue(e.target.value)}
                placeholder="Enter total lectures"
                autoFocus
              />
            ) : (
              <p className="text-2xl font-bold text-primary">{chapter.totalLectures}</p>
            )}
          </div>

          {/* Target Hours */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-accent-cyan icon-animated" />
                <span className="font-semibold">Target Hours</span>
              </div>
              {!isEditingTargetHours ? (
                <Button size="sm" variant="ghost" onClick={() => { setIsEditingTargetHours(true); setEditTargetHoursValue(chapter.targetHoursOverride?.toString() || ''); }} className="icon-animated">
                  <Edit2 className="h-4 w-4" />
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={handleSaveTargetHours} className="icon-animated">
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setIsEditingTargetHours(false)} className="icon-animated">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            {isEditingTargetHours ? (
              <div className="space-y-2">
                <Input
                  type="number"
                  step="0.1"
                  value={editTargetHoursValue}
                  onChange={(e) => setEditTargetHoursValue(e.target.value)}
                  placeholder="Enter target hours (leave empty to use computed)"
                  autoFocus
                />
                <p className="text-xs text-muted-foreground">
                  Computed: {computedTargetHours.toFixed(1)}h (leave empty to use this)
                </p>
              </div>
            ) : (
              <div>
                <p className="text-2xl font-bold text-accent-cyan">{effectiveTargetHours.toFixed(1)}h</p>
                {chapter.targetHoursOverride !== undefined && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Override active (computed: {computedTargetHours.toFixed(1)}h)
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Date to Finish */}
          {activeSettings.autoRecalculateDateToFinish && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-success icon-animated" />
                <span className="font-semibold">Estimated Date to Finish</span>
              </div>
              <p className="text-lg font-semibold text-success">{calculateDateToFinish() || 'N/A'}</p>
            </div>
          )}

          {/* Status Actions */}
          <div className="space-y-3 pt-4 border-t border-border">
            <p className="font-semibold text-sm text-muted-foreground">Update Status</p>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={chapter.status === 'Completed' ? 'default' : 'outline'}
                size="sm"
                onClick={handleComplete}
                className={`flex-col h-auto py-3 transition-smooth icon-animated ${
                  chapter.status === 'Completed' 
                    ? 'bg-success hover:bg-success/90 text-white border-success' 
                    : 'hover:bg-success/10 hover:text-success hover:border-success'
                }`}
              >
                <Check className="h-5 w-5 mb-1" />
                <span className="text-xs">Complete</span>
              </Button>
              <Button
                variant={chapter.status === 'Incomplete' ? 'default' : 'outline'}
                size="sm"
                onClick={handleIncomplete}
                className={`flex-col h-auto py-3 transition-smooth icon-animated ${
                  chapter.status === 'Incomplete' 
                    ? 'bg-warning hover:bg-warning/90 text-white border-warning' 
                    : 'hover:bg-warning/10 hover:text-warning hover:border-warning'
                }`}
              >
                <Clock className="h-5 w-5 mb-1" />
                <span className="text-xs">Incomplete</span>
              </Button>
              <Button
                variant={chapter.status === 'Tough' ? 'default' : 'outline'}
                size="sm"
                onClick={handleTough}
                className={`flex-col h-auto py-3 transition-smooth icon-animated ${
                  chapter.status === 'Tough' 
                    ? 'bg-destructive hover:bg-destructive/90 text-white border-destructive' 
                    : 'hover:bg-destructive/10 hover:text-destructive hover:border-destructive'
                }`}
              >
                <X className="h-5 w-5 mb-1" />
                <span className="text-xs">Tough</span>
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
