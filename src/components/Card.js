// Card.js
import React from 'react';

const Card = ({ children, style = {} }) => {
  return (
    <div style={{
      backgroundColor: '#F2ECE4',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      padding: '1rem',
      marginBottom: '1rem',
      ...style
    }}>
      {children}
    </div>
  );
};

export default Card;