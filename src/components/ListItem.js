import React from 'react';

const ListItem = ({ title, subtitle, rightContent, onClick }) => {
  return (
    <div 
      className="flex justify-between items-center py-3 px-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
      onClick={onClick}
    >
      <div>
        <h4 className="font-medium text-gray-900">{title}</h4>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
      {rightContent && <div>{rightContent}</div>}
    </div>
  );
};

export default ListItem;