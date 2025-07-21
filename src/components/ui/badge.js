// components/ui/badge.js
'use client';

import * as React from 'react';

const Badge = React.forwardRef(({ className, variant = 'default', ...props }, ref) => (
  <span
    ref={ref}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: '9999px',
      border: '1px solid',
      padding: '0.25rem 0.625rem',
      fontSize: '0.75rem',
      fontWeight: '600',
      transition: 'background-color 0.2s, color 0.2s',
      ...(variant === 'default' && {
        borderColor: '#E5E7EB',
        backgroundColor: '#F3F4F6',
        color: '#374151'
      }),
      ...(variant === 'outline' && {
        borderColor: '#E5E7EB',
        color: '#374151'
      })
    }}
    {...props}
  />
));
Badge.displayName = 'Badge';

export { Badge };