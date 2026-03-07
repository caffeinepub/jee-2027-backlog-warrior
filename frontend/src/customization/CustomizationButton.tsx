import { Button } from '../components/ui/button';
import { Settings } from 'lucide-react';

interface CustomizationButtonProps {
  onClick: () => void;
}

export function CustomizationButton({ onClick }: CustomizationButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      className="h-9 w-9"
      aria-label="Open customization settings"
    >
      <Settings className="h-4 w-4" />
    </Button>
  );
}
