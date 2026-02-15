import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Home, Calendar, BookOpen, FileText, ClipboardList, Timer } from 'lucide-react';
import { useSubjects } from '../hooks/useSubjects';
import { Button } from './ui/button';

export function BottomNavigation() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { subjects } = useSubjects();

  const currentPath = routerState.location.pathname;

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/calendar', label: 'Calendar', icon: Calendar },
    { path: '/countdown', label: 'Countdown', icon: Timer },
    { path: '/notes', label: 'Notes', icon: FileText },
    { path: '/tests', label: 'Tests', icon: ClipboardList },
    ...subjects.map(subject => ({
      path: `/subject/${subject.id}`,
      label: subject.name,
      icon: BookOpen,
    })),
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-border/60 bg-card/95 backdrop-blur-xl supports-[backdrop-filter]:bg-card/80 shadow-lg">
      <div className="horizontal-scroll">
        <div className="flex items-center gap-1 px-2 py-2 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Button
                key={item.path}
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: item.path })}
                className={`shrink-0 flex flex-col items-center gap-1 px-4 py-2 min-w-[80px] transition-smooth icon-animated ${
                  active
                    ? 'bg-primary/10 text-primary border border-primary/30 shadow-glow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? 'icon-active' : ''}`} />
                <span className="text-xs font-medium truncate max-w-[70px]">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
