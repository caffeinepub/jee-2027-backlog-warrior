import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Button } from './ui/button';
import { Calculator, Atom, FlaskConical, Palette, BookOpen, Home, CalendarDays, Trophy } from 'lucide-react';
import { useSubjects } from '../hooks/useSubjects';

const SUBJECT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'mathematics': Calculator,
  'physics': Atom,
  'chemistry': FlaskConical,
};

export function BottomNavigation() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { subjects } = useSubjects();

  const getSubjectPath = (subjectId: string): string => {
    // Use legacy routes for default subjects
    if (subjectId === 'mathematics') return '/math';
    if (subjectId === 'physics') return '/physics';
    if (subjectId === 'chemistry') return '/chemistry';
    return `/subject/${subjectId}`;
  };

  const isSubjectActive = (subjectId: string): boolean => {
    const path = getSubjectPath(subjectId);
    return currentPath === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="w-full h-16 px-2">
        {/* Single Horizontally Scrollable Container */}
        <div className="horizontal-scroll-container overflow-x-auto overflow-y-hidden h-full">
          <div className="flex items-center gap-1 h-full px-1">
            {/* Home Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: '/' })}
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 flex-shrink-0 ${
                currentPath === '/' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Home className="h-5 w-5" />
              <span className="text-xs font-medium">Home</span>
            </Button>

            {/* Subject Icons */}
            {subjects.map((subject) => {
              const Icon = SUBJECT_ICONS[subject.id] || BookOpen;
              const isActive = isSubjectActive(subject.id);
              const path = getSubjectPath(subject.id);
              
              return (
                <Button
                  key={subject.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate({ to: path })}
                  className={`flex flex-col items-center gap-1 h-auto py-2 px-3 flex-shrink-0 ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium whitespace-nowrap">{subject.name}</span>
                </Button>
              );
            })}

            {/* Calendar Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: '/calendar' })}
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 flex-shrink-0 ${
                currentPath === '/calendar' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <CalendarDays className="h-5 w-5" />
              <span className="text-xs font-medium">Calendar</span>
            </Button>

            {/* Tests Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: '/tests' })}
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 flex-shrink-0 ${
                currentPath === '/tests' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Trophy className="h-5 w-5" />
              <span className="text-xs font-medium">Tests</span>
            </Button>

            {/* Customize Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: '/customize' })}
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 flex-shrink-0 ${
                currentPath === '/customize' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Palette className="h-5 w-5" />
              <span className="text-xs font-medium">Customize</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
