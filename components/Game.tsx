'use client'
import React, { useState, useEffect } from 'react';
import '@/components/Game.scss';
import Board from '@/components/Board';
import { useUser } from '@auth0/nextjs-auth0/client';  // ใช้ useUser เพื่อตรวจสอบสถานะล็อกอิน

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

  // ตรวจสอบผลเสมอ
  if (!squares.includes('')) {
    return 'Draw';
  }

  return null; // ยังไม่มีผู้ชนะ
};

// ชนิดของความยาก
type Difficulty = 'easy' | 'medium' | 'hard';

const Game: React.FC = () => {
  const { user, isLoading } = useUser();  // ตรวจสอบสถานะของผู้ใช้
  const [squares, setSquares] = useState(Array(9).fill(''));
  const [isXNext, setIsXNext] = useState(true);  // ผู้เล่น X เริ่มก่อน
  const [isGameOver, setIsGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium'); // ความยากตั้งต้น
  const [playerScore, setPlayerScore] = useState(0);
  const [consecutiveWins, setConsecutiveWins] = useState(0); 
  const [isGameStarted, setIsGameStarted] = useState(false); // ควบคุมว่าเริ่มเกมแล้วหรือยัง
  const winner = calculateWinner(squares);

  // Use effect to let AI play when it's AI's turn
  useEffect(() => {
    if (!isXNext && !isGameOver) {
      aiMove();
    }
  }, [isXNext, squares, isGameOver, difficulty]);

  // ฟังก์ชันที่ผู้เล่นคลิก
  const handleClick = (index: number) => {
    if (squares[index] || isGameOver) return; // ถ้าเกมจบหรือช่องเต็มแล้ว ไม่ให้คลิก

    const newSquares = squares.slice();
    newSquares[index] = isXNext ? 'X' : 'O';
    setSquares(newSquares);
    setIsXNext(!isXNext);
  };

  // ฟังก์ชันรีเซ็ตเกม
  const handleReset = () => {
    setSquares(Array(9).fill(''));
    setIsXNext(true);
    setIsGameOver(false);
    setPlayerScore(0); // รีเซ็ตคะแนน
    setConsecutiveWins(0); // รีเซ็ตการชนะติดต่อ
    setIsGameStarted(false); // กลับไปที่หน้าจอเริ่มต้น
  };

  const handleContinue = () => {
    setSquares(Array(9).fill(''));
    setIsXNext(true);
    setIsGameOver(false);
  };

  // ฟังก์ชันให้ AI เล่น
  const aiMove = () => {
    if (isGameOver) return; // ถ้าเกมจบแล้ว ไม่ให้ AI เล่น
    const emptySquares = squares.map((value, index) => value === '' ? index : -1).filter(index => index !== -1);

    if (emptySquares.length === 0) return;

    let bestMove: number;
    switch (difficulty) {
      case 'easy':
        bestMove = easyAiMove(emptySquares);
        break;
      case 'medium':
        bestMove = minimax(squares, emptySquares, 0, false, 3); // ความลึก 3 สำหรับ medium
        break;
      case 'hard':
        bestMove = minimax(squares, emptySquares, 0, false, 9); // ความลึก 9 สำหรับ hard
        break;
    }

    const newSquares = squares.slice();
    newSquares[bestMove] = 'O';
    setSquares(newSquares);
    setIsXNext(true); // Switch to Player X after AI move
  };

  // Easy AI - Random move
  const easyAiMove = (emptySquares: number[]): number => {
    const randomIndex = Math.floor(Math.random() * emptySquares.length);
    return emptySquares[randomIndex];
  };

  // ฟังก์ชัน Minimax สำหรับ AI
  const minimax = (board: string[], availableMoves: number[], depth: number, isMaximizingPlayer: boolean, maxDepth: number): number => {
    const winner = calculateWinner(board);
    if (winner === 'X') return -10 + depth; // ถ้าผู้เล่น X ชนะ
    if (winner === 'O') return 10 - depth; // ถ้า AI ชนะ
    if (availableMoves.length === 0 || depth === maxDepth) return 0; // ถ้าเสมอ

    let bestScore = isMaximizingPlayer ? -Infinity : Infinity;
    let bestMove = -1;

    for (let i = 0; i < availableMoves.length; i++) {
      const move = availableMoves[i];
      const newBoard = board.slice();
      newBoard[move] = isMaximizingPlayer ? 'O' : 'X'; // ทำการเลือก
      const newAvailableMoves = availableMoves.filter(m => m !== move);
      const score = minimax(newBoard, newAvailableMoves, depth + 1, !isMaximizingPlayer, maxDepth);

      if (isMaximizingPlayer) {
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      } else {
        if (score < bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }
    }

    return bestMove;
  };

  // เมื่อเกมจบแล้วจะทำการอัพเดตคะแนน
  useEffect(() => {
    if (winner || winner === 'Draw') {
      setIsGameOver(true);
      updateScore(winner);
    }
  }, [winner]);

  const updateScore = (result: string | null) => {
    if (result === 'X') {
      setPlayerScore(prevScore => Math.max(prevScore + 1, 0)); // ผู้เล่น X ชนะ
      setConsecutiveWins(prev => prev + 1); // เพิ่มจำนวนครั้งที่ชนะติดต่อกัน
    } else if (result === 'O') {
      setPlayerScore(prevScore => Math.max(prevScore - 1, 0)); // ผู้เล่น O (AI) ชนะ
      setConsecutiveWins(0); // รีเซ็ตการชนะติดต่อ
    } else if (result === 'Draw') {
      setPlayerScore(prevScore => Math.max(prevScore, 0)); // เสมอ
      setConsecutiveWins(0); // รีเซ็ตการชนะติดต่อ
    }

    // ให้คะแนนพิเศษเมื่อชนะติดต่อ 3 ครั้ง
    if (consecutiveWins === 2) {
      setPlayerScore(prevScore => prevScore + 1); // ให้คะแนนพิเศษ
      setConsecutiveWins(0); // รีเซ็ตการชนะติดต่อ
    }
  };

  // ปุ่ม Start Game
  const handleStartGame = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    setIsGameStarted(true); // เริ่มเกม
  };

  const handleLogin = () => {
    window.location.href = '/api/auth/login';
  };

  const handleLogout = () => {
    window.location.href = '/api/auth/logout';
  };

  return (
    <div className="container">
      {!isGameStarted ? (
        <div>
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
          {user ? (
            <>
              <button className="startButton" onClick={() => handleStartGame(difficulty)}>Start Game</button>
              <button className="logoutButton" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <button className="loginButton" onClick={handleLogin}>Login</button>
          )}
        </div>
      ) : (
        <div>
          <div className="board">
            <Board squares={squares} onClick={handleClick} />
          </div>
          <div className="gameInfo winMessage">
            {winner ? (winner === 'Draw' ? "It's a draw!" : `${winner} wins!`) : `${isXNext ? 'Player X' : 'Player O'}'s turn`}
          </div>
          <div className="score playerScore">Player Score: {playerScore}</div>
          <div className="score consecutiveWins">Consecutive Wins: {consecutiveWins}</div>
          <button className="restartButton" onClick={handleReset}>Restart</button>
          <button className="continueButton" onClick={handleContinue}>Continue</button>
        </div>
      )}
    </div>
  );
};

export default Game;
