import React from 'react';

const SectionHeader = ({ title, actionText, onActionClick }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      {actionText && (
        <button 
          onClick={onActionClick}
          className="text-primary-600 hover:text-primary-800 text-sm font-medium"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default SectionHeader;