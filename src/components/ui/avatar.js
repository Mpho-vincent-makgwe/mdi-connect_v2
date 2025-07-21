// components/ui/avatar.js
'use client';

import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';

const Avatar = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    style={{
      position: 'relative',
      display: 'flex',
      height: '2.5rem',
      width: '2.5rem',
      flexShrink: 0,
      overflow: 'hidden',
      borderRadius: '9999px'
    }}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    style={{
      aspectRatio: '1 / 1',
      height: '100%',
      width: '100%'
    }}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    style={{
      display: 'flex',
      height: '100%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '9999px',
      backgroundColor: '#F3F4F6'
    }}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };