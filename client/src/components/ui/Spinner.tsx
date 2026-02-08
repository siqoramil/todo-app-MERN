import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <Loader2
      className={cn('animate-spin text-primary', sizeMap[size], className)}
    />
  );
}

export function FullPageSpinner() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
