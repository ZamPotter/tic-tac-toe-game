// components/Game.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import '@/components/Game.scss';
import Board from '@/components/Board';

// คำนวณผลชนะ
const calculateWinner = (squares: string[]): string | null => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  // Check for a draw (if no winner and no empty spaces left)
  if (!squares.includes('')) {
    return 'Draw';
  }

  return null; // No winner yet
};

type Difficulty = 'easy' | 'medium' | 'hard';

const Game: React.FC = () => {
  const { user, isLoading } = useUser(); // ใช้ useUser เพื่อเช็คสถานะการล็อกอิน
  const router = useRouter();
  const [squares, setSquares] = useState(Array(9).fill(''));
  const [isXNext, setIsXNext] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [playerScore, setPlayerScore] = useState(0);
  const [consecutiveWins, setConsecutiveWins] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const winner = calculateWinner(squares);

  // ใช้ useEffect เพื่อให้มั่นใจว่าไม่มีการเรียก setState ในระหว่าง render
  useEffect(() => {
    if (!isXNext && !isGameOver) {
      aiMove();
    }
  }, [isXNext, squares, isGameOver, difficulty]);

  const handleClick = (index: number) => {
    if (squares[index] || isGameOver) return;
    const newSquares = squares.slice();
    newSquares[index] = isXNext ? 'X' : 'O';
    setSquares(newSquares);
    setIsXNext(!isXNext);
  };

  const handleReset = () => {
    setSquares(Array(9).fill(''));
    setIsXNext(true);
    setIsGameOver(false);
    setPlayerScore(0);
    setConsecutiveWins(0);
    setIsGameStarted(false);
  };

  const handleContinue = () => {
    setSquares(Array(9).fill(''));
    setIsXNext(true);
    setIsGameOver(false);
  };

  const handleStartGame = (selectedDifficulty: Difficulty) => {
    if (!user) {
      // ถ้าผู้ใช้ยังไม่ล็อกอิน นำไปที่หน้า Auth0 Login
      router.push('/api/auth/login');
    } else {
      // ถ้าล็อกอินแล้ว ให้เริ่มเกมได้
      setDifficulty(selectedDifficulty);
      setIsGameStarted(true);
    }
  };

  const aiMove = () => {
    if (isGameOver) return;
    const emptySquares = squares.map((value, index) => value === '' ? index : -1).filter(index => index !== -1);
    if (emptySquares.length === 0) return;
    let bestMove: number;
    switch (difficulty) {
      case 'easy':
        bestMove = easyAiMove(emptySquares);
        break;
      case 'medium':
        bestMove = minimax(squares, emptySquares, 0, false, 3);
        break;
      case 'hard':
        bestMove = minimax(squares, emptySquares, 0, false, 9);
        break;
    }
    const newSquares = squares.slice();
    newSquares[bestMove] = 'O';
    setSquares(newSquares);
    setIsXNext(true);
  };

  const easyAiMove = (emptySquares: number[]): number => {
    const randomIndex = Math.floor(Math.random() * emptySquares.length);
    return emptySquares[randomIndex];
  };

  const minimax = (board: string[], availableMoves: number[], depth: number, isMaximizingPlayer: boolean, maxDepth: number): number => {
    const winner = calculateWinner(board);
    if (winner === 'X') return -10 + depth;
    if (winner === 'O') return 10 - depth;
    if (availableMoves.length === 0 || depth === maxDepth) return 0;
    let bestScore = isMaximizingPlayer ? -Infinity : Infinity;
    let bestMove = -1;
    for (let i = 0; i < availableMoves.length; i++) {
      const move = availableMoves[i];
      const newBoard = board.slice();
      newBoard[move] = isMaximizingPlayer ? 'O' : 'X';
      const newAvailableMoves = availableMoves.filter(m => m !== move);
      const score = minimax(newBoard, newAvailableMoves, depth + 1, !isMaximizingPlayer, maxDepth);
      if (isMaximizingPlayer ? score > bestScore : score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
    return bestMove;
  };

  useEffect(() => {
    if (winner || winner === 'Draw') {
      setIsGameOver(true);
      updateScore(winner);
    }
  }, [winner]);

  const updateScore = (result: string | null) => {
    if (result === 'X') {
      setPlayerScore(prevScore => Math.max(prevScore + 1, 0));
      setConsecutiveWins(prev => prev + 1);
    } else if (result === 'O') {
      setPlayerScore(prevScore => Math.max(prevScore - 1, 0));
      setConsecutiveWins(0);
    } else if (result === 'Draw') {
      setPlayerScore(prevScore => Math.max(prevScore, 0));
      setConsecutiveWins(0);
    }
    if (consecutiveWins === 2) {
      setPlayerScore(prevScore => prevScore + 1);
      setConsecutiveWins(0);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container">
      {!isGameStarted ? (
        <div>
          {user ? (
            <a href="/api/auth/logout">Logout</a>
          ) : (
            <a href="/api/auth/login">Login</a>
          )}
          <h2 className="title">Welcome to Tic-Tac-Toe</h2>
          <div className="difficultySelection">
            <label>
              <input
                type="radio"
                name="difficulty"
                value="easy"
                checked={difficulty === 'easy'}
                onChange={() => setDifficulty('easy')}
              /> Easy
            </label>
            <label>
              <input
                type="radio"
                name="difficulty"
                value="medium"
                checked={difficulty === 'medium'}
                onChange={() => setDifficulty('medium')}
              /> Medium
            </label>
            <label>
              <input
                type="radio"
                name="difficulty"
                value="hard"
                checked={difficulty === 'hard'}
                onChange={() => setDifficulty('hard')}
              /> Hard
            </label>
          </div>
          <button className="startButton" onClick={() => handleStartGame(difficulty)}>Start Game</button>
        </div>
      ) : (
        <div>
          <div className="board">
            <Board squares={squares} onClick={handleClick} />
          </div>
          <div className="gameInfo">
            {winner ? (winner === 'Draw' ? "It's a draw!" : `${winner} wins!`) : `${isXNext ? 'Player X' : 'Player O'}'s turn`}
          </div>
          <div className="score">Player Score: {playerScore}</div>
          <div className="score">Consecutive Wins: {consecutiveWins}</div>
          <button className="restartButton" onClick={handleReset}>Restart</button>
          <button className="continueButton" onClick={handleContinue}>Continue</button>
        </div>
      )}
    </div>
  );
};

export default Game;
