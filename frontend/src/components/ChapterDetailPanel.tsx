import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { type Chapter } from '../data/chapters';
import { useChapterData } from '../hooks/useChapterData';
import { BookOpen, Clock, CheckCircle2, Circle, AlertCircle, Edit2, Save, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface ChapterDetailPanelProps {
  chapter: Chapter;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChapterDetailPanel({ chapter, open, onOpenChange }: ChapterDetailPanelProps) {
  const { updateChapterFields, updateChapterStatus } = useChapterData();
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(chapter.name);
  
  const [isEditingLectures, setIsEditingLectures] = useState(false);
  const [editedLectures, setEditedLectures] = useState(chapter.totalLectures.toString());
  
  const [isEditingHours, setIsEditingHours] = useState(false);
  const [editedHours, setEditedHours] = useState('');

  useEffect(() => {
    setEditedName(chapter.name);
    setEditedLectures(chapter.totalLectures.toString());
    const currentHours = chapter.targetHoursOverride ?? (chapter.totalLectures * chapter.lectureDuration) / 60;
    setEditedHours(currentHours.toFixed(1));
  }, [chapter]);

  const handleSaveName = () => {
    if (editedName.trim() && editedName !== chapter.name) {
      updateChapterFields(chapter.id, { name: editedName.trim() });
      toast.success('Chapter name updated');
    }
    setIsEditingName(false);
  };

  const handleSaveLectures = () => {
    const lectures = parseInt(editedLectures, 10);
    if (!isNaN(lectures) && lectures > 0 && lectures !== chapter.totalLectures) {
      updateChapterFields(chapter.id, { totalLectures: lectures });
      toast.success('Total lectures updated');
    }
    setIsEditingLectures(false);
  };

  const handleSaveHours = () => {
    const hours = parseFloat(editedHours);
    if (!isNaN(hours) && hours > 0) {
      updateChapterFields(chapter.id, { targetHoursOverride: hours });
      toast.success('Hours updated');
    }
    setIsEditingHours(false);
  };

  const handleClearHoursOverride = () => {
    updateChapterFields(chapter.id, { targetHoursOverride: undefined });
    const computedHours = (chapter.totalLectures * chapter.lectureDuration) / 60;
    setEditedHours(computedHours.toFixed(1));
    toast.success('Hours reset to computed value');
  };

  const handleStatusClick = (status: Chapter['status']) => {
    if (chapter.status === status) {
      // Toggle back to Not Started
      updateChapterStatus(chapter.id, 'Not Started');
      toast.success('Status cleared');
    } else {
      updateChapterStatus(chapter.id, status);
      toast.success(`Status set to ${status}`);
    }
  };

  const targetHours = chapter.targetHoursOverride ?? (chapter.totalLectures * chapter.lectureDuration) / 60;
  const hasOverride = chapter.targetHoursOverride !== undefined;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <div 
          className="absolute top-0 right-0 w-1/2 h-48 opacity-5 bg-no-repeat bg-right-top bg-contain pointer-events-none"
          style={{ backgroundImage: 'url(/assets/generated/study-illustration-line.dim_1200x400.png)' }}
        />
        
        <SheetHeader className="relative z-10">
          <div className="space-y-3">
            {/* Chapter Name */}
            {isEditingName ? (
              <div className="space-y-2">
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveName();
                    if (e.key === 'Escape') setIsEditingName(false);
                  }}
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveName}>
                    <Save className="h-3.5 w-3.5 mr-1" />
                    Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setIsEditingName(false)}>
                    <X className="h-3.5 w-3.5 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-2">
                <SheetTitle className="text-2xl font-bold flex-1">{chapter.name}</SheetTitle>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsEditingName(true)}
                  className="shrink-0 h-8 w-8"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
            )}
            <SheetDescription>
              Manage chapter details, status, and working time
            </SheetDescription>
          </div>
        </SheetHeader>

        <div className="space-y-6 mt-6 relative z-10">
          {/* Status Section */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Status</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={chapter.status === 'Not Started' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusClick('Not Started')}
                className="gap-2"
              >
                <Circle className="h-4 w-4" />
                Not Started
              </Button>
              <Button
                variant={chapter.status === 'Incomplete' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusClick('Incomplete')}
                className={`gap-2 ${
                  chapter.status === 'Incomplete'
                    ? 'bg-warning text-warning-foreground hover:bg-warning/90'
                    : 'hover:bg-warning/20 hover:text-warning hover:border-warning/30'
                }`}
              >
                <AlertCircle className="h-4 w-4" />
                Incomplete
              </Button>
              <Button
                variant={chapter.status === 'Tough' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusClick('Tough')}
                className={`gap-2 ${
                  chapter.status === 'Tough'
                    ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                    : 'hover:bg-destructive/20 hover:text-destructive hover:border-destructive/30'
                }`}
              >
                <AlertCircle className="h-4 w-4" />
                Tough
              </Button>
              <Button
                variant={chapter.status === 'Completed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusClick('Completed')}
                className={`gap-2 ${
                  chapter.status === 'Completed'
                    ? 'bg-success text-success-foreground hover:bg-success/90'
                    : 'hover:bg-success/20 hover:text-success hover:border-success/30'
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                Completed
              </Button>
            </div>
          </div>

          <Separator />

          {/* Chapter Details */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Chapter Details</Label>
            
            {/* Total Lectures */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="total-lectures" className="text-sm text-muted-foreground">
                  Total Lectures
                </Label>
                {!isEditingLectures && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditingLectures(true)}
                    className="h-7 px-2"
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
              {isEditingLectures ? (
                <div className="space-y-2">
                  <Input
                    id="total-lectures"
                    type="number"
                    min="1"
                    value={editedLectures}
                    onChange={(e) => setEditedLectures(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveLectures();
                      if (e.key === 'Escape') setIsEditingLectures(false);
                    }}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveLectures}>
                      <Save className="h-3.5 w-3.5 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setIsEditingLectures(false)}>
                      <X className="h-3.5 w-3.5 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span className="font-semibold">{chapter.totalLectures} lectures</span>
                </div>
              )}
            </div>

            {/* Hours */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="hours" className="text-sm text-muted-foreground">
                  Hours {hasOverride && <Badge variant="outline" className="ml-2 text-xs">Custom</Badge>}
                </Label>
                {!isEditingHours && (
                  <div className="flex gap-1">
                    {hasOverride && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleClearHoursOverride}
                        className="h-7 px-2 text-xs"
                      >
                        Reset
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditingHours(true)}
                      className="h-7 px-2"
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
              {isEditingHours ? (
                <div className="space-y-2">
                  <Input
                    id="hours"
                    type="number"
                    min="0.1"
                    step="0.5"
                    value={editedHours}
                    onChange={(e) => setEditedHours(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveHours();
                      if (e.key === 'Escape') setIsEditingHours(false);
                    }}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveHours}>
                      <Save className="h-3.5 w-3.5 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setIsEditingHours(false)}>
                      <X className="h-3.5 w-3.5 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                  <Clock className="h-5 w-5 text-accent-cyan" />
                  <span className="font-semibold">{targetHours.toFixed(1)} hours</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
