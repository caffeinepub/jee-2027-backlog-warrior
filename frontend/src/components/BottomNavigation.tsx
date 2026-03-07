import { SubjectsBar } from './SubjectsBar';

export function BottomNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-border/60 bg-card/95 backdrop-blur-xl supports-[backdrop-filter]:bg-card/80 shadow-lg">
      <SubjectsBar />
    </nav>
  );
}
