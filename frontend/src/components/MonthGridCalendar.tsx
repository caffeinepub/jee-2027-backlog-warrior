import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

interface MonthGridCalendarProps {
  currentMonth: Date;
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  getDayIndicator?: (dateKey: string) => { hasEntries: boolean; count: number };
}

export function MonthGridCalendar({
  currentMonth,
  selectedDate,
  onSelectDate,
  onPreviousMonth,
  onNextMonth,
  onToday,
  getDayIndicator,
}: MonthGridCalendarProps) {
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday
  
  // Get days from previous month to fill the grid
  const prevMonthLastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0).getDate();
  const prevMonthDays = startingDayOfWeek;
  
  // Calculate total cells needed
  const totalCells = Math.ceil((daysInMonth + startingDayOfWeek) / 7) * 7;
  const nextMonthDays = totalCells - daysInMonth - prevMonthDays;
  
  const days: Array<{ date: Date; isCurrentMonth: boolean; dateKey: string }> = [];
  
  // Previous month days
  for (let i = prevMonthDays - 1; i >= 0; i--) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, prevMonthLastDay - i);
    days.push({
      date,
      isCurrentMonth: false,
      dateKey: date.toISOString().split('T')[0],
    });
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
    days.push({
      date,
      isCurrentMonth: true,
      dateKey: date.toISOString().split('T')[0],
    });
  }
  
  // Next month days
  for (let i = 1; i <= nextMonthDays; i++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, i);
    days.push({
      date,
      isCurrentMonth: false,
      dateKey: date.toISOString().split('T')[0],
    });
  }
  
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };
  
  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };
  
  return (
    <div className="space-y-4">
      {/* Header with navigation */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{monthName}</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onToday}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={onPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const indicator = getDayIndicator?.(day.dateKey);
          const hasEntries = indicator?.hasEntries || false;
          const entryCount = indicator?.count || 0;
          
          return (
            <button
              key={index}
              onClick={() => onSelectDate(day.date)}
              className={cn(
                'relative aspect-square p-2 text-sm rounded-md transition-colors',
                'hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring',
                day.isCurrentMonth ? 'text-foreground' : 'text-muted-foreground/40',
                isToday(day.date) && 'bg-primary/10 font-bold',
                isSelected(day.date) && 'bg-primary text-primary-foreground hover:bg-primary/90',
                !day.isCurrentMonth && 'opacity-50'
              )}
            >
              <span className="flex items-center justify-center h-full">
                {day.date.getDate()}
              </span>
              {hasEntries && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                  {entryCount > 0 && (
                    <div className="w-1 h-1 rounded-full bg-primary" />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
