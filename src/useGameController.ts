import { useState, useEffect } from "react";
import {
  createBoard,
  getWinner,
  getWinningLine,
  isBoardFull,
  HUMAN,
  AI,
} from "./game";
import type { Board, Player } from "./game";
import { getBestMove } from "./minimax";

/** Outcome / turn state only — no copy for the UI. */
export type GamePhase =
  | { kind: "playing"; turn: "human" | "ai" }
  | { kind: "won"; winner: Player }
  | { kind: "draw" };

export type GameController = {
  board: Board;
  phase: GamePhase;
  winningLine: number[] | null;
  isCellPlayable: (index: number) => boolean;
  playCell: (index: number) => void;
  reset: () => void;
};

const AI_MOVE_DELAY_MS = 200;

export function useGameController(): GameController {
  const [board, setBoard] = useState<Board>(createBoard);
  const [isHumanTurn, setIsHumanTurn] = useState(true);

  const winner = getWinner(board);
  const draw = !winner && isBoardFull(board);
  const gameOver = winner !== null || draw;
  const winningLine = winner ? getWinningLine(board) : null;

  const phase: GamePhase = winner
    ? { kind: "won", winner }
    : draw
      ? { kind: "draw" }
      : { kind: "playing", turn: isHumanTurn ? "human" : "ai" };

  useEffect(() => {
    if (isHumanTurn || gameOver) return;

    const timer = setTimeout(() => {
      const move = getBestMove(board);
      if (move === -1) return;

      const next = [...board] as Board;
      next[move] = AI;
      setBoard(next);
      setIsHumanTurn(true);
    }, AI_MOVE_DELAY_MS);

    return () => clearTimeout(timer);
  }, [isHumanTurn, board, gameOver]);

  function playCell(index: number) {
    if (gameOver || !isHumanTurn || board[index] !== null) return;

    const next = [...board] as Board;
    next[index] = HUMAN;
    setBoard(next);
    setIsHumanTurn(false);
  }

  function isCellPlayable(index: number): boolean {
    return !gameOver && isHumanTurn && board[index] === null;
  }

  function reset() {
    setBoard(createBoard());
    setIsHumanTurn(true);
  }

  return {
    board,
    phase,
    winningLine,
    isCellPlayable,
    playCell,
    reset,
  };
}
