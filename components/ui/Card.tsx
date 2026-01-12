'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-white rounded-xl shadow-lg',
      bordered: 'bg-white rounded-xl border-2 border-gray-200',
      elevated: 'bg-white rounded-xl shadow-xl',
    };

    return (
      <div
        ref={ref}
        className={cn(variants[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card Header
const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('p-4 border-b border-gray-100', className)}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

// Card Content
const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('p-4', className)}
      {...props}
    />
  )
);
CardContent.displayName = 'CardContent';

// Card Footer
const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('p-4 border-t border-gray-100', className)}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardContent, CardFooter };
