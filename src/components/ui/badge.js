'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const Badge = React.forwardRef(({ className, variant = 'default', ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2',
      variant === 'default' && 'border-gray-200 bg-gray-100 text-gray-800',
      variant === 'outline' && 'border-gray-200 text-gray-800',
      className
    )}
    {...props}
  />
));
Badge.displayName = 'Badge';

export { Badge };