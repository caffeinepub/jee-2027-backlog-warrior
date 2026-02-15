import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useChapterData } from '../hooks/useChapterData';
import { useSubjects } from '../hooks/useSubjects';
import { BarChart3 } from 'lucide-react';

export function DashboardCompletionDistributionChart() {
  const { chapters } = useChapterData();
  const { subjects } = useSubjects();

  const subjectStats = subjects.map(subject => {
    const subjectChapters = chapters.filter(ch => ch.subjectId === subject.id);
    const completed = subjectChapters.filter(ch => ch.status === 'Completed').length;
    const total = subjectChapters.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;

    return {
      name: subject.name,
      completed,
      total,
      percentage,
    };
  });

  const maxTotal = Math.max(...subjectStats.map(s => s.total), 1);

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-smooth hover-lift">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary icon-animated" />
          <CardTitle className="text-lg">Completion by Subject</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {subjectStats.map((stat, idx) => (
            <div key={stat.name} className="space-y-2 chart-item" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{stat.name}</span>
                <span className="text-muted-foreground">
                  {stat.completed}/{stat.total} ({stat.percentage.toFixed(0)}%)
                </span>
              </div>
              <div className="relative h-8 bg-muted/30 rounded-lg overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-success to-success/70 rounded-lg transition-all duration-1000 ease-out chart-bar-fill"
                  style={{ width: `${stat.percentage}%` }}
                />
                <div
                  className="absolute inset-y-0 left-0 bg-muted/50 rounded-lg"
                  style={{ width: `${(stat.total / maxTotal) * 100}%`, opacity: 0.3 }}
                />
              </div>
            </div>
          ))}
          {subjectStats.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No subjects yet. Add subjects to see completion stats.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
