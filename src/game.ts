// ─── Types ────────────────────────────────────────────────────────────────────

export type Player = "X" | "O";
export type Cell = Player | null;
export type Board = Cell[]; // 9 cells, indices 0-8

// ─── Constants ────────────────────────────────────────────────────────────────

export const HUMAN: Player = "X";
export const AI: Player = "O";

// All eight lines that win the game (rows, columns, diagonals).
export const WIN_LINES: number[][] = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left column
  [1, 4, 7], // middle column
  [2, 5, 8], // right column
  [0, 4, 8], // diagonal top-left → bottom-right
  [2, 4, 6], // diagonal top-right → bottom-left
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Returns the player who has completed a winning line, or null if no winner yet. */
export function getWinner(board: Board): Player | null {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] !== null && board[a] === board[b] && board[a] === board[c]) {
      return board[a] as Player;
    }
  }
  return null;
}

/** Returns the indices of the winning line, or null if there is no winner. */
export function getWinningLine(board: Board): number[] | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] !== null && board[a] === board[b] && board[a] === board[c]) {
      return line;
    }
  }
  return null;
}

/** Returns true when every cell is filled (no nulls remain). */
export function isBoardFull(board: Board): boolean {
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) return false;
  }
  return true;
}

/** Returns the indices of every empty cell. */
export function getAvailableMoves(board: Board): number[] {
  const moves: number[] = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) moves.push(i);
  }
  return moves;
}

/** Returns a fresh, empty 9-cell board. */
export function createBoard(): Board {
  return Array(9).fill(null);
}
