'use client';

import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Number of skeleton cards to display
   */
  count?: number;
  /**
   * Skeleton variant - card or line
   */
  variant?: 'card' | 'line' | 'text';
  /**
   * Height of skeleton
   */
  height?: string;
  /**
   * Width of skeleton
   */
  width?: string;
}

/**
 * Skeleton component - loading placeholder with shimmer effect
 */
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ count = 1, variant = 'card', height, width, className = '', ...props }, ref) => {
    const baseClasses = 'animate-shimmer rounded-lg';

    const variantClasses = {
      card: `h-64 bg-[var(--card)]`,
      line: `h-4 bg-[var(--card)]`,
      text: `h-6 bg-[var(--card)]`,
    };

    const customHeight = height ? `h-[${height}]` : '';
    const customWidth = width ? `w-[${width}]` : '';

    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            ref={i === 0 ? ref : null}
            className={`${baseClasses} ${variantClasses[variant]} ${customHeight} ${customWidth} ${className}`}
            {...props}
          />
        ))}
      </>
    );
  }
);

Skeleton.displayName = 'Skeleton';

/**
 * SkeletonCard - complete skeleton for note card
 */
export const SkeletonCard: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="space-y-4 p-6 bg-[var(--card)]/60 rounded-2xl border border-[var(--border)]"
        >
          <Skeleton variant="text" className="h-6 w-3/4" />
          <div className="space-y-2">
            <Skeleton variant="line" className="h-4 w-full" />
            <Skeleton variant="line" className="h-4 w-5/6" />
            <Skeleton variant="line" className="h-4 w-4/6" />
          </div>
          <div className="flex justify-between pt-4">
            <Skeleton variant="line" className="h-4 w-1/3" />
            <Skeleton variant="line" className="h-4 w-1/4" />
          </div>
        </div>
      ))}
    </>
  );
};

export default Skeleton;
