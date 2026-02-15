import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Bell, AlertCircle, Calendar } from 'lucide-react';
import { useChapterData } from '../hooks/useChapterData';
import { useTodosAll } from '../hooks/useTodosAll';
import { useCalendarEntries } from '../hooks/useCalendarEntries';
import { useSubjects } from '../hooks/useSubjects';

export function NotificationsSection() {
  const { chapters } = useChapterData();
  const { getAllTodos } = useTodosAll();
  const { getAllEntries } = useCalendarEntries();
  const { getSubjectById } = useSubjects();

  // Get incomplete chapters
  const incompleteChapters = chapters.filter(ch => ch.status !== 'Completed');

  // Get incomplete todos
  const allTodos = getAllTodos();
  const incompleteTodos = allTodos.filter(todo => !todo.completed);

  // Get today's calendar entries
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const allEntries = getAllEntries();
  const todayEntries = allEntries[todayKey] || [];

  const incompleteItems = [
    ...incompleteChapters.map(ch => ({
      type: 'chapter' as const,
      name: ch.name,
      subject: getSubjectById(ch.subjectId)?.name || 'Unknown',
      status: ch.status,
    })),
    ...incompleteTodos.map(todo => ({
      type: 'todo' as const,
      name: todo.text,
      subject: getSubjectById(todo.subjectId)?.name || 'Unknown',
    })),
  ];

  const dueTodayItems = todayEntries.map(entry => ({
    type: 'calendar' as const,
    name: entry.text,
  }));

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-smooth hover-lift">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary icon-animated" />
          <CardTitle className="text-lg">Notifications</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Incomplete Work */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-warning" />
            <h3 className="font-semibold text-sm">Incomplete Work</h3>
            <Badge variant="outline" className="ml-auto bg-warning/20 text-warning border-warning/30">
              {incompleteItems.length}
            </Badge>
          </div>
          {incompleteItems.length === 0 ? (
            <p className="text-sm text-muted-foreground pl-6">All caught up! 🎉</p>
          ) : (
            <div className="space-y-1 pl-6 max-h-48 overflow-y-auto">
              {incompleteItems.slice(0, 10).map((item, idx) => (
                <div key={idx} className="text-sm flex items-start gap-2 py-1">
                  <span className="text-muted-foreground">•</span>
                  <div className="flex-1">
                    <span className="text-foreground">{item.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">({item.subject})</span>
                    {item.type === 'chapter' && item.status && (
                      <Badge 
                        variant="outline" 
                        className={`ml-2 text-xs ${
                          item.status === 'Tough' 
                            ? 'bg-destructive/20 text-destructive border-destructive/30' 
                            : 'bg-warning/20 text-warning border-warning/30'
                        }`}
                      >
                        {item.status}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
              {incompleteItems.length > 10 && (
                <p className="text-xs text-muted-foreground pt-1">
                  +{incompleteItems.length - 10} more items
                </p>
              )}
            </div>
          )}
        </div>

        {/* Due Today */}
        <div className="space-y-2 pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">Due Today</h3>
            <Badge variant="outline" className="ml-auto bg-primary/20 text-primary border-primary/30">
              {dueTodayItems.length}
            </Badge>
          </div>
          {dueTodayItems.length === 0 ? (
            <p className="text-sm text-muted-foreground pl-6">Nothing scheduled for today</p>
          ) : (
            <div className="space-y-1 pl-6">
              {dueTodayItems.map((item, idx) => (
                <div key={idx} className="text-sm flex items-start gap-2 py-1">
                  <span className="text-muted-foreground">•</span>
                  <span className="text-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
