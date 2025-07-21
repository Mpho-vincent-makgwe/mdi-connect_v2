// ListItem.js
import React from 'react';

const ListItem = ({ title, subtitle, rightContent, onClick }) => {
  return (
    <div 
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 1rem',
        borderBottom: '1px solid rgba(242, 236, 228, 0.5)',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        ':hover': {
          backgroundColor: 'rgba(242, 236, 228, 0.5)'
        }
      }}
      onClick={onClick}
    >
      <div>
        <h4 style={{
          fontWeight: '500',
          color: '#1A1A1A'
        }}>{title}</h4>
        {subtitle && <p style={{
          fontSize: '0.875rem',
          color: 'rgba(140, 60, 30, 0.7)'
        }}>{subtitle}</p>}
      </div>
      {rightContent && <div>{rightContent}</div>}
    </div>
  );
};

export default ListItem;