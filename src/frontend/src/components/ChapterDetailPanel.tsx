import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Check, X, Clock, BookOpen, Calendar } from 'lucide-react';
import { type Chapter } from '../data/chapters';
import { useChapterData } from '../hooks/useChapterData';
import { useCustomization } from '../customization/CustomizationProvider';
import { useSubjects } from '../hooks/useSubjects';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';

interface ChapterDetailPanelProps {
  chapter: Chapter;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChapterDetailPanel({ chapter, open, onOpenChange }: ChapterDetailPanelProps) {
  const { updateChapterStatus } = useChapterData();
  const { settings, draftSettings } = useCustomization();
  const { getSubjectById } = useSubjects();
  const activeSettings = draftSettings || settings;
  
  const subject = getSubjectById(chapter.subjectId);
  const targetHours = (chapter.totalLectures * chapter.lectureDuration) / (activeSettings.lectureSpeedFactor * 60);
  
  const calculateDateToFinish = () => {
    if (!activeSettings.autoRecalculateDateToFinish) return null;
    
    const today = new Date();
    const daysNeeded = Math.ceil(targetHours / activeSettings.dailyTargetHours);
    const finishDate = new Date(today);
    finishDate.setDate(finishDate.getDate() + daysNeeded);
    
    return finishDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleComplete = () => {
    updateChapterStatus(chapter.id, 'Completed');
    onOpenChange(false);
  };

  const handleIncomplete = () => {
    updateChapterStatus(chapter.id, 'Incomplete');
    onOpenChange(false);
  };

  const handleTough = () => {
    updateChapterStatus(chapter.id, 'Tough');
    onOpenChange(false);
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
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span className="font-medium">Total Lectures</span>
              </div>
              <span className="text-2xl font-bold">{chapter.totalLectures}</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="font-medium">Target Hours</span>
              </div>
              <span className="text-2xl font-bold">{targetHours.toFixed(1)}</span>
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
              Calculation based on {activeSettings.lectureSpeedFactor}x playback speed and {activeSettings.dailyTargetHours}h daily target.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
