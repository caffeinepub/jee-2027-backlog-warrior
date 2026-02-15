import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Plus } from 'lucide-react';

interface AddChapterDialogProps {
  subjectId: string;
  subjectName: string;
  onAdd: (name: string, totalLectures: number, lectureDuration: number) => void;
}

export function AddChapterDialog({ subjectId, subjectName, onAdd }: AddChapterDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [totalLectures, setTotalLectures] = useState('');
  const [lectureDuration, setLectureDuration] = useState('90');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const lectures = parseInt(totalLectures);
    const duration = parseInt(lectureDuration);
    
    if (name.trim() && lectures > 0 && duration > 0) {
      onAdd(name.trim(), lectures, duration);
      setName('');
      setTotalLectures('');
      setLectureDuration('90');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Chapter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Chapter</DialogTitle>
            <DialogDescription>
              Add a new chapter to {subjectName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="chapter-name">Chapter Name *</Label>
              <Input
                id="chapter-name"
                placeholder="e.g., Thermodynamics"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total-lectures">Total Lectures *</Label>
              <Input
                id="total-lectures"
                type="number"
                min="1"
                placeholder="e.g., 15"
                value={totalLectures}
                onChange={(e) => setTotalLectures(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lecture-duration">Lecture Duration (minutes)</Label>
              <Input
                id="lecture-duration"
                type="number"
                min="1"
                placeholder="90"
                value={lectureDuration}
                onChange={(e) => setLectureDuration(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Default: 90 minutes</p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Chapter</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
