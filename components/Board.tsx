// components/Board.tsx
import React from 'react';
import Square from '@/components/Square';

type BoardProps = {
  squares: string[];
  onClick: (index: number) => void;
};

const Board: React.FunctionComponent<BoardProps> = ({ squares, onClick }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 100px)', gap: '5px' }}>
      {squares.map((value, index) => (
        <Square key={index} value={value} onClick={() => onClick(index)} />
      ))}
    </div>
  );
};

export default Board;
