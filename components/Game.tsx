// components/Game.tsx
'use client'
import React, { useState, useEffect } from 'react';
import Board from '@/components/Board';

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
  const [squares, setSquares] = useState(Array(9).fill(''));
  const [isXNext, setIsXNext] = useState(true); // Player X starts
  const [isGameOver, setIsGameOver] = useState(false); // To track game over status
  const [difficulty, setDifficulty] = useState<Difficulty>('medium'); // Default difficulty is medium
  const [playerScore, setPlayerScore] = useState(0); // To track the player's score
  const [consecutiveWins, setConsecutiveWins] = useState(0); // Track consecutive wins
  const [isGameStarted, setIsGameStarted] = useState(false); // Track if game is started
  const winner = calculateWinner(squares);

  // Use effect to let AI play when it's AI's turn or when difficulty changes
  useEffect(() => {
    if (!isXNext && !isGameOver) {
      aiMove(); // AI will play only when it's its turn (isXNext = false) and the game is not over
    }
  }, [isXNext, squares, isGameOver, difficulty]); // Add difficulty to dependencies

  const handleClick = (index: number) => {
    if (squares[index] || isGameOver) return; // Don't allow click if game is over or the square is already filled

    const newSquares = squares.slice();
    newSquares[index] = isXNext ? 'X' : 'O';
    setSquares(newSquares);
    setIsXNext(!isXNext);
  };

  const handleReset = () => {
    // Reset the game and go back to the start screen
    setSquares(Array(9).fill(''));
    setIsXNext(true);
    setIsGameOver(false);
    setPlayerScore(0); // Reset score on restart
    setConsecutiveWins(0); // Reset consecutive wins
    setIsGameStarted(false); // Go back to the start screen
  };

  const handleContinue = () => {
    setSquares(Array(9).fill(''));
    setIsXNext(true);
    setIsGameOver(false);
  };

  const aiMove = () => {
    if (isGameOver) return; // Prevent AI move if the game is over

    // AI plays only if it's the AI's turn and game is not over
    const emptySquares = squares.map((value, index) => value === '' ? index : -1).filter(index => index !== -1);

    if (emptySquares.length === 0) return; // Don't make move if no empty squares left

    let bestMove: number;
    switch (difficulty) {
      case 'easy':
        bestMove = easyAiMove(emptySquares);
        break;
      case 'medium':
        bestMove = minimax(squares, emptySquares, 0, false, 3); // Depth 3 for medium
        break;
      case 'hard':
        bestMove = minimax(squares, emptySquares, 0, false, 9); // Depth 9 for hard
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

  // Minimax algorithm with depth limit
  const minimax = (board: string[], availableMoves: number[], depth: number, isMaximizingPlayer: boolean, maxDepth: number): number => {
    const winner = calculateWinner(board);
    if (winner === 'X') return -10 + depth; // Player X wins
    if (winner === 'O') return 10 - depth; // AI (O) wins
    if (availableMoves.length === 0 || depth === maxDepth) return 0; // Draw or max depth reached

    let bestScore = isMaximizingPlayer ? -Infinity : Infinity;
    let bestMove = -1;

    for (let i = 0; i < availableMoves.length; i++) {
      const move = availableMoves[i];
      const newBoard = board.slice();
      newBoard[move] = isMaximizingPlayer ? 'O' : 'X'; // Make the move
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

  useEffect(() => {
    // Set game over status when there is a winner or a draw
    if (winner || winner === 'Draw') {
      setIsGameOver(true);
      updateScore(winner);
    }
  }, [winner]);

  // Update score based on the game result
  const updateScore = (result: string | null) => {
    if (result === 'X') {
      setPlayerScore(prevScore => Math.max(prevScore + 1, 0)); // Player X wins
      setConsecutiveWins(prev => prev + 1); // Increase consecutive wins count
    } else if (result === 'O') {
      setPlayerScore(prevScore => Math.max(prevScore - 1, 0)); // Player O (AI) wins
      setConsecutiveWins(0); // Reset consecutive wins for AI loss
    } else if (result === 'Draw') {
      setPlayerScore(prevScore => Math.max(prevScore, 0)); // Draw
      setConsecutiveWins(0); // Reset consecutive wins if it's a draw
    }

    // Add bonus point for 3 consecutive wins
    if (consecutiveWins === 2) {
      setPlayerScore(prevScore => prevScore + 1); // Reward with an extra point
      setConsecutiveWins(0); // Reset consecutive wins count
    }
  };

  const handleStartGame = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    setIsGameStarted(true); // Game is started, so show game board
  };

  return (
    <div>
      {!isGameStarted ? (
        <div>
          <h1>Welcome to Tic-Tac-Toe</h1>
          <div>
            <h3>Select Difficulty</h3>
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
          <button onClick={() => handleStartGame(difficulty)}>Start Game</button>
        </div>
      ) : (
        <div>
          <Board squares={squares} onClick={handleClick} />
          <div>
            {winner ? (winner === 'Draw' ? "It's a draw!" : `${winner} wins!`) : `${isXNext ? 'Player X' : 'Player O'}'s turn`}
          </div>
          <div>Player Score: {playerScore}</div>
          <div>Consecutive Wins: {consecutiveWins}</div>
          <button onClick={handleReset}>Restart</button>
          <button onClick={handleContinue}>Continue</button>
        </div>
      )}
    </div>
  );
};

export default Game;
