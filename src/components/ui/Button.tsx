import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  className,
  ...props
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center transition-colors duration-200 font-sans tracking-wide uppercase disabled:opacity-50 disabled:pointer-events-none";

  const variantClasses = {
    "bg-[#c9a96e] text-[#0a0a0a] hover:bg-[#b8956a]": variant === 'primary',
    "bg-[#faf7f4] text-[#0a0a0a] hover:bg-[#f5f0eb]": variant === 'secondary',
    "border border-[#c9a96e] text-[#c9a96e] hover:bg-[#c9a96e]/10": variant === 'outline',
    "text-[#faf7f4] hover:text-[#c9a96e]": variant === 'ghost',
  };

  const sizeClasses = {
    "px-4 py-2 text-sm": size === 'sm',
    "px-6 py-3": size === 'md',
    "px-8 py-4 text-lg": size === 'lg',
  };

  const classes = cn(baseClasses, variantClasses, sizeClasses, className);

  if (href) {
    const isExternal = /^https?:\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');

    if (isExternal) {
      const anchorProps = props as React.AnchorHTMLAttributes<HTMLAnchorElement>;

      return (
        <a href={href} className={classes} {...anchorProps}>
          {children}
        </a>
      );
    }

    return (
      <Link
        href={href}
        className={classes}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}