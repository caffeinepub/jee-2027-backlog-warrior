import { Outlet, useRouterState } from '@tanstack/react-router';
import { BottomNavigation } from './BottomNavigation';
import { CustomizationButton } from '../customization/CustomizationButton';
import { CustomizationPanel } from '../customization/CustomizationPanel';
import { CustomizationProvider } from '../customization/CustomizationProvider';
import { TasksDrawer } from './TasksDrawer';
import { PageTransition } from './PageTransition';
import { useState } from 'react';

export function Layout() {
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const routerState = useRouterState();
  const isCustomizePage = routerState.location.pathname === '/customize';

  return (
    <CustomizationProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col relative">
        {!isCustomizePage && (
          <header className="sticky top-0 z-30 w-full border-b border-border/60 bg-card/95 backdrop-blur-xl supports-[backdrop-filter]:bg-card/80 transition-smooth shadow-lg">
            <div className="container flex h-16 items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <TasksDrawer />
                <h1 className="text-xl font-bold font-display bg-gradient-to-r from-primary via-accent-cyan to-accent-lime bg-clip-text text-transparent">
                  11
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground hidden sm:inline">
                  ~P UMESH PAVAN GOUD~
                </span>
                <span className="text-xs font-medium text-muted-foreground sm:hidden">
                  ~P UMESH PAVAN GOUD~
                </span>
                <CustomizationButton onClick={() => setIsCustomizationOpen(true)} />
              </div>
            </div>
          </header>
        )}
        
        <main className={isCustomizePage ? 'flex-1' : 'flex-1 pb-20'}>
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
        
        {!isCustomizePage && <BottomNavigation />}
        
        <CustomizationPanel 
          open={isCustomizationOpen} 
          onOpenChange={setIsCustomizationOpen} 
        />
      </div>
    </CustomizationProvider>
  );
}
