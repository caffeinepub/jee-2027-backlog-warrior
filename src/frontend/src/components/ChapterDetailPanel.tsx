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
  
  // Calculate target hours: use override if present, otherwise compute
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
    updateChapterStatus(chapter.id, 'Completed');
  };

  const handleIncomplete = () => {
    updateChapterStatus(chapter.id, 'Incomplete');
  };

  const handleTough = () => {
    updateChapterStatus(chapter.id, 'Tough');
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
      // Clear override
      updateChapterFields(chapter.id, { targetHoursOverride: undefined });
      setIsEditingTargetHours(false);
      toast.success('Target hours override cleared');
      return;
    }
    if (isNaN(value) || value <= 0) {
      toast.error('Please enter a valid number of hours');
      return;
    }
    updateChapterFields(chapter.id, { targetHoursOverride: value });
    setIsEditingTargetHours(false);
    toast.success('Target hours override saved');
  };

  const dateToFinish = calculateDateToFinish();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{chapter.name}</SheetTitle>
          <SheetDescription>{subject?.name || 'Unknown Subject'}</SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          <div className="space-y-4">
            {/* Total Lectures */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span className="font-medium">Total Lectures</span>
              </div>
              {isEditingLectures ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={editLecturesValue}
                    onChange={(e) => setEditLecturesValue(e.target.value)}
                    className="w-20 h-8 text-right"
                    min="1"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleSaveLectures}
                    className="h-8 w-8 p-0"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setIsEditingLectures(false);
                      setEditLecturesValue(chapter.totalLectures.toString());
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{chapter.totalLectures}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditingLectures(true)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            
            {/* Target Hours */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <div className="flex flex-col">
                  <span className="font-medium">Target Hours</span>
                  {chapter.targetHoursOverride !== undefined && (
                    <span className="text-xs text-muted-foreground">(Override)</span>
                  )}
                </div>
              </div>
              {isEditingTargetHours ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    step="0.1"
                    value={editTargetHoursValue}
                    onChange={(e) => setEditTargetHoursValue(e.target.value)}
                    placeholder="Auto"
                    className="w-20 h-8 text-right"
                    min="0"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleSaveTargetHours}
                    className="h-8 w-8 p-0"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setIsEditingTargetHours(false);
                      setEditTargetHoursValue(chapter.targetHoursOverride?.toString() || '');
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{effectiveTargetHours.toFixed(1)}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditingTargetHours(true)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            
            {dateToFinish && (
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span className="font-medium">Date to Finish</span>
                </div>
                <span className="text-lg font-semibold">{dateToFinish}</span>
              </div>
            )}
            
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <span className="font-medium">Current Status</span>
              <Badge variant="outline">{chapter.status}</Badge>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Update Status</h3>
            
            <Button 
              onClick={handleComplete}
              className="w-full justify-start gap-2"
              variant="outline"
            >
              <Check className="h-4 w-4" />
              Mark as Completed
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  className="w-full justify-start gap-2"
                  variant="outline"
                >
                  <X className="h-4 w-4" />
                  Mark as Incomplete or Tough
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Choose Status</AlertDialogTitle>
                  <AlertDialogDescription>
                    Select whether this chapter is incomplete or tough.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleIncomplete}>
                    Incomplete
                  </AlertDialogAction>
                  <AlertDialogAction onClick={handleTough} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Tough
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              {chapter.targetHoursOverride !== undefined 
                ? 'Using custom target hours override.'
                : `Calculation based on ${activeSettings.lectureSpeedFactor}x playback speed and ${activeSettings.dailyTargetHours}h daily target.`
              }
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
