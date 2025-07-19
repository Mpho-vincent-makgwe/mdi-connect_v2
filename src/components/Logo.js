// components/Logo.js
import React from 'react';

const Logo = ({ className, variant = 'default' }) => {
  // Define color variants
  const variants = {
    default: {
      primary: 'text-blue-600',
      secondary: 'text-blue-500',
      bg: 'bg-blue-100',
    },
    dark: {
      primary: 'text-white',
      secondary: 'text-blue-300',
      bg: 'bg-blue-800',
    },
    minimal: {
      primary: 'text-blue-600',
      secondary: 'text-blue-600',
      bg: 'bg-transparent',
    },
  };

  const currentVariant = variants[variant] || variants.default;

  return (
    <div className={`flex items-center ${className}`}>
      {/* Symbol/Icon part */}
      <div className={`flex items-center justify-center rounded-lg w-10 h-10 ${currentVariant.bg} mr-3`}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-6 h-6 ${currentVariant.primary}`}
        >
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M15 9H15.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M9 9H9.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M8 12H16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Text part */}
      <div className="flex flex-col">
        <span className={`font-bold text-xl leading-5 ${currentVariant.primary}`}>MDI</span>
        <span className={`font-medium text-sm ${currentVariant.secondary}`}>Connect</span>
      </div>
    </div>
  );
};

export const LogoIcon = ({ className = 'w-6 h-6', color = 'text-blue-600' }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M15 9H15.01"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M9 9H9.01"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M8 12H16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default Logo;