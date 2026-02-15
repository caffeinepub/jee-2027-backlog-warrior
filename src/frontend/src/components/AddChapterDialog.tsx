import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Plus } from 'lucide-react';

interface AddChapterDialogProps {
  subjectId: string;
  subjectName: string;
  onAdd: (name: string, totalLectures: number, hours: number) => void;
}

export function AddChapterDialog({ subjectId, subjectName, onAdd }: AddChapterDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [totalLectures, setTotalLectures] = useState('');
  const [hours, setHours] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const lectures = parseInt(totalLectures);
    const hoursValue = parseFloat(hours);
    
    if (name.trim() && lectures > 0 && hoursValue > 0) {
      onAdd(name.trim(), lectures, hoursValue);
      setName('');
      setTotalLectures('');
      setHours('');
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
              <Label htmlFor="hours">Hours *</Label>
              <Input
                id="hours"
                type="number"
                min="0.1"
                step="0.5"
                placeholder="e.g., 22.5"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">Estimated hours to complete this chapter</p>
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
