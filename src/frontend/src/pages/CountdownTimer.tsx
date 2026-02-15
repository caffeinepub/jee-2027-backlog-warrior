import { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useCountdownTarget } from '../hooks/useCountdownTarget';
import { useCountdownTimer } from '../hooks/useCountdownTimer';

export function CountdownTimer() {
  const { targetDate, setTargetDate } = useCountdownTarget();
  const { days, hours, minutes, seconds, isExpired } = useCountdownTimer(targetDate);
  const [dateTimeInput, setDateTimeInput] = useState('');

  // Initialize input from stored target date
  useEffect(() => {
    if (targetDate) {
      // Format as datetime-local input value (YYYY-MM-DDTHH:mm)
      const date = new Date(targetDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hour = String(date.getHours()).padStart(2, '0');
      const minute = String(date.getMinutes()).padStart(2, '0');
      setDateTimeInput(`${year}-${month}-${day}T${hour}:${minute}`);
    }
  }, [targetDate]);

  const handleDateTimeChange = (value: string) => {
    setDateTimeInput(value);
    if (value) {
      const newDate = new Date(value);
      if (!isNaN(newDate.getTime())) {
        setTargetDate(newDate.toISOString());
      }
    }
  };

  return (
    <div className="countdown-page min-h-screen pb-24 pt-6 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold countdown-title">
            Countdown Timer
          </h1>
          <p className="countdown-subtitle text-lg">
            Set your target date and watch the countdown
          </p>
        </div>

        {/* Date Picker Card */}
        <Card className="countdown-card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Calendar className="h-5 w-5" />
              Set Target Date & Time
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="target-datetime" className="text-base">
                Choose your target date and time
              </Label>
              <Input
                id="target-datetime"
                type="datetime-local"
                value={dateTimeInput}
                onChange={(e) => handleDateTimeChange(e.target.value)}
                className="countdown-input text-lg h-12"
              />
              <p className="text-sm countdown-help-text">
                Select a future date and time to start the countdown
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Countdown Display */}
        {targetDate && (
          <Card className="countdown-display-card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Clock className="h-5 w-5" />
                Time Remaining
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isExpired ? (
                <div className="text-center py-12">
                  <p className="text-3xl md:text-4xl font-bold countdown-expired">
                    🎉 Time is up! 🎉
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  <div className="countdown-segment">
                    <div className="countdown-number">{String(days).padStart(2, '0')}</div>
                    <div className="countdown-label">Days</div>
                  </div>
                  <div className="countdown-segment">
                    <div className="countdown-number">{String(hours).padStart(2, '0')}</div>
                    <div className="countdown-label">Hours</div>
                  </div>
                  <div className="countdown-segment">
                    <div className="countdown-number">{String(minutes).padStart(2, '0')}</div>
                    <div className="countdown-label">Mins</div>
                  </div>
                  <div className="countdown-segment">
                    <div className="countdown-number">{String(seconds).padStart(2, '0')}</div>
                    <div className="countdown-label">Secs</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!targetDate && (
          <Card className="countdown-empty-card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <CardContent className="py-12 text-center">
              <Clock className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl countdown-empty-text">
                Set a target date above to start your countdown
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
