import { Outlet, useNavigate } from '@tanstack/react-router';
import { Button } from './ui/button';
import { Settings, Menu } from 'lucide-react';
import { CustomizationButton } from '../customization/CustomizationButton';
import { CustomizationPanel } from '../customization/CustomizationPanel';
import { CustomizationProvider } from '../customization/CustomizationProvider';
import { useState } from 'react';
import { TasksDrawer } from './TasksDrawer';
import { BottomNavigation } from './BottomNavigation';
import { ShareAppLinkDialog } from './ShareAppLinkDialog';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { APP_VERSION } from '../lib/appVersion';
import { Badge } from './ui/badge';

export function Layout() {
  const navigate = useNavigate();
  const [customizationOpen, setCustomizationOpen] = useState(false);
  const { identity, clear } = useInternetIdentity();

  const principal = identity?.getPrincipal().toString();
  const displayName = principal ? `${principal.slice(0, 8)}...${principal.slice(-6)}` : 'Guest';

  return (
    <CustomizationProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/80 shadow-sm">
          <div className="container flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <TasksDrawer />
              <button
                onClick={() => navigate({ to: '/' })}
                className="flex items-center gap-3 group"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent-cyan to-accent-lime rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative bg-gradient-to-r from-primary via-accent-cyan to-accent-lime p-2 rounded-lg">
                    <svg
                      className="h-6 w-6 text-primary-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xl font-bold bg-gradient-to-r from-primary via-accent-cyan to-accent-lime bg-clip-text text-transparent">
                    Study Planner
                  </span>
                  <Badge variant="outline" className="text-xs px-1.5 py-0 h-4">
                    {APP_VERSION.label}
                  </Badge>
                </div>
              </button>
            </div>
            <div className="flex items-center gap-2">
              {identity && (
                <>
                  <span className="text-sm text-muted-foreground hidden sm:inline">
                    {displayName}
                  </span>
                  <ShareAppLinkDialog />
                </>
              )}
              <CustomizationButton onClick={() => setCustomizationOpen(true)} />
              {identity && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clear}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Logout
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="pb-14">
          <Outlet />
        </main>

        {/* Bottom Navigation */}
        <BottomNavigation />

        {/* Customization Panel */}
        <CustomizationPanel open={customizationOpen} onOpenChange={setCustomizationOpen} />
      </div>
    </CustomizationProvider>
  );
}
