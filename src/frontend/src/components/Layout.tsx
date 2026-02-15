import { Outlet, useRouterState } from '@tanstack/react-router';
import { BottomNavigation } from './BottomNavigation';
import { CustomizationButton } from '../customization/CustomizationButton';
import { CustomizationPanel } from '../customization/CustomizationPanel';
import { CustomizationProvider } from '../customization/CustomizationProvider';
import { TasksDrawer } from './TasksDrawer';
import { useState } from 'react';

export function Layout() {
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const routerState = useRouterState();
  const isCustomizePage = routerState.location.pathname === '/customize';

  return (
    <CustomizationProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {!isCustomizePage && (
          <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <TasksDrawer />
                <h1 className="text-lg font-bold">11</h1>
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
          <Outlet />
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
