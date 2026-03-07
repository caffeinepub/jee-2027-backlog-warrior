import { useRouterState } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const routerState = useRouterState();
  const [displayLocation, setDisplayLocation] = useState(routerState.location.pathname);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (displayLocation !== routerState.location.pathname) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setDisplayLocation(routerState.location.pathname);
        setIsTransitioning(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [routerState.location.pathname, displayLocation]);

  return (
    <div
      className={`transition-all duration-300 ease-out ${
        isTransitioning ? 'opacity-0' : 'opacity-100 animate-fade-in-up'
      }`}
    >
      {children}
    </div>
  );
}
