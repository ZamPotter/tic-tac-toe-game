// components/Square.tsx
import React from 'react';

type SquareProps = {
  value: string;
  onClick: () => void;
};

const Square: React.FunctionComponent<SquareProps> = ({ value, onClick }) => {
  return (
    <button 
      onClick={onClick} 
      style={{ width: '100px', height: '100px', fontSize: '24px' }}
    >
      {value}
    </button>
  );
};

export default Square;
