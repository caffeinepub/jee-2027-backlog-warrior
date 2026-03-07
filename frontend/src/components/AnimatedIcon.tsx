import { type LucideIcon } from 'lucide-react';
import { type ComponentProps } from 'react';

interface AnimatedIconProps extends ComponentProps<'div'> {
  icon: LucideIcon;
  isActive?: boolean;
  size?: number;
}

export function AnimatedIcon({ icon: Icon, isActive = false, size = 20, className = '', ...props }: AnimatedIconProps) {
  return (
    <div
      className={`icon-animated ${isActive ? 'icon-active' : ''} ${className}`}
      {...props}
    >
      <Icon size={size} />
    </div>
  );
}
