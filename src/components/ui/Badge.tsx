import { cn } from '@/lib/utils';
import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'outline' | 'dark';
}

export function Badge({ children, variant = 'dark', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs uppercase tracking-wider font-sans",
        {
          "bg-[#c9a96e] text-[#0a0a0a]": variant === 'gold',
          "border border-[#faf7f4]/30 text-[#faf7f4]": variant === 'outline',
          "bg-[#1a1a1a] text-[#faf7f4]": variant === 'dark',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}