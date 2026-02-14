import { HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullScreen?: boolean;
  label?: string;
}

export function Spinner({
  size = 'md',
  fullScreen = false,
  label,
  className,
  ...props
}: SpinnerProps) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const spinner = (
    <div
      className={clsx(
        'flex flex-col items-center justify-center gap-2',
        fullScreen && 'fixed inset-0 bg-background/80 backdrop-blur-sm z-50',
        className
      )}
      {...props}
    >
      <Loader2 className={clsx('animate-spin text-primary', sizes[size])} />
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );

  return spinner;
}

export function PageSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner size="lg" label="Ładowanie..." />
    </div>
  );
}