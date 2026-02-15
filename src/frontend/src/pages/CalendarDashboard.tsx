import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { CalendarDays, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { useCalendarEntries } from '../hooks/useCalendarEntries';
import { MonthGridCalendar } from '../components/MonthGridCalendar';
import { ScrollArea } from '../components/ui/scroll-area';
import { toast } from 'sonner';

export function CalendarDashboard() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [newEntry, setNewEntry] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  
  const { getEntriesForDate, addEntry, updateEntry, deleteEntry, getAllEntries } = useCalendarEntries();
  
  const dateKey = selectedDate.toISOString().split('T')[0];
  const entries = getEntriesForDate(dateKey);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEntry.trim()) {
      addEntry(dateKey, newEntry.trim());
      setNewEntry('');
      toast.success('Work item added!');
    }
  };

  const handleStartEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const handleSaveEdit = () => {
    if (editingId && editText.trim()) {
      updateEntry(dateKey, editingId, editText.trim());
      setEditingId(null);
      setEditText('');
      toast.success('Work item updated!');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleDelete = (id: string) => {
    deleteEntry(dateKey, id);
    toast.success('Work item deleted!');
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
  };

  const getDayIndicator = (dateKey: string) => {
    const allEntries = getAllEntries();
    const dayEntries = allEntries[dateKey] || [];
    return {
      hasEntries: dayEntries.length > 0,
      count: dayEntries.length,
    };
  };

  const formattedDate = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <CalendarDays className="h-8 w-8 text-primary" />
          Calendar Dashboard
        </h2>
        <p className="text-muted-foreground mt-2">Plan and track your work for each day</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
        {/* Left Side - Month Grid Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthGridCalendar
              currentMonth={currentMonth}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onPreviousMonth={handlePreviousMonth}
              onNextMonth={handleNextMonth}
              onToday={handleToday}
              getDayIndicator={getDayIndicator}
            />
          </CardContent>
        </Card>

        {/* Right Side - Work To-Do List */}
        <Card className="lg:sticky lg:top-20 lg:self-start">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">
              Work To-Do
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{formattedDate}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add New Entry Form */}
            <form onSubmit={handleAddEntry} className="flex gap-2">
              <Input
                placeholder="Add work to do..."
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </form>

            {/* Entries List */}
            <ScrollArea className="h-[400px] lg:h-[500px]">
              <div className="space-y-2 pr-4">
                {entries.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarDays className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No work items for this date</p>
                    <p className="text-xs mt-1">Add your first task above</p>
                  </div>
                ) : (
                  entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center gap-2 p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
                    >
                      {editingId === entry.id ? (
                        <>
                          <Input
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="flex-1"
                            autoFocus
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleSaveEdit}
                          >
                            <Check className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleCancelEdit}
                          >
                            <X className="h-4 w-4 text-red-600" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <span className="flex-1 text-sm">{entry.text}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleStartEdit(entry.id, entry.text)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(entry.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
