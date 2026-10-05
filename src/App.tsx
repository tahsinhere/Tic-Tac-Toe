import { useState, useEffect } from "react";
import { createBoard, getWinner, isBoardFull, HUMAN, AI } from "./game";
import type { Board } from "./game";
import { getBestMove } from "./minimax";

export default function App() {
  const [board, setBoard] = useState<Board>(createBoard());
  const [isHumanTurn, setIsHumanTurn] = useState(true);

  const winner = getWinner(board);
  const draw = !winner && isBoardFull(board);
  const gameOver = winner !== null || draw;

  // ── AI turn ────────────────────────────────────────────────────────────────
  // When it becomes the AI's turn and the game is still going, run minimax
  // and place the AI's move after a short delay so it feels responsive.
  useEffect(() => {
    if (isHumanTurn || gameOver) return;

    const timer = setTimeout(() => {
      const move = getBestMove(board);
      if (move === -1) return; // no moves available (shouldn't happen)

      const next = [...board] as Board;
      next[move] = AI;
      setBoard(next);
      setIsHumanTurn(true);
    }, 200); // 200 ms pause so the AI doesn't feel instant

    return () => clearTimeout(timer);
  }, [isHumanTurn, board, gameOver]);

  // ── Human move ─────────────────────────────────────────────────────────────
  function handleCellClick(index: number) {
    // Ignore clicks when: game is over, not human's turn, or cell is occupied.
    if (gameOver || !isHumanTurn || board[index] !== null) return;

    const next = [...board] as Board;
    next[index] = HUMAN;
    setBoard(next);
    setIsHumanTurn(false);
  }

  // ── Reset ──────────────────────────────────────────────────────────────────
  function handleNewGame() {
    setBoard(createBoard());
    setIsHumanTurn(true);
  }

  // ── Status message ─────────────────────────────────────────────────────────
  let status: string;
  if (winner === HUMAN) status = "You win! 🎉";
  else if (winner === AI) status = "Computer wins!";
  else if (draw) status = "It's a draw!";
  else if (isHumanTurn) status = "Your turn (X)";
  else status = "Computer is thinking…";

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="container">
      <h1>Tic-Tac-Toe</h1>

      <p className="legend">You are <strong>X</strong> &nbsp;·&nbsp; Computer is <strong>O</strong></p>

      <p className="status">{status}</p>

      <div className="board">
        {board.map((cell, index) => (
          <button
            key={index}
            className={`cell ${cell === HUMAN ? "cell-x" : cell === AI ? "cell-o" : ""}`}
            onClick={() => handleCellClick(index)}
            disabled={gameOver || !isHumanTurn || cell !== null}
            aria-label={`Cell ${index + 1}: ${cell ?? "empty"}`}
          >
            {cell}
          </button>
        ))}
      </div>

      <button className="new-game" onClick={handleNewGame}>
        New Game
      </button>
    </div>
  );
}
