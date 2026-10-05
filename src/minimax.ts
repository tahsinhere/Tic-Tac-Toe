import type { Board } from "./game";
import { AI, HUMAN, getWinner, isBoardFull, getAvailableMoves } from "./game";

// ─── Minimax ─────────────────────────────────────────────────────────────────
//
// Minimax is a decision algorithm used in two-player games.
// The AI (O) tries to MAXIMISE its score; the human (X) tries to MINIMISE it.
// The algorithm explores every possible future move and "backs up" the best
// score so the AI always picks the optimal path.

/**
 * Recursively scores a board position.
 *
 * @param board   The current board state being evaluated.
 * @param isAiTurn  True when it is the AI's (maximising) turn.
 * @returns  +10 if AI wins, -10 if Human wins, 0 for a draw.
 */
function minimax(board: Board, isAiTurn: boolean): number {
  // ── 1. Terminal-state scoring ─────────────────────────────────────────────
  // Before exploring further, check if the game is already over.
  // A positive score is good for the AI; a negative score is good for the human.
  const winner = getWinner(board);
  if (winner === AI)    return +10; // AI has won — best possible outcome
  if (winner === HUMAN) return -10; // Human has won — worst possible outcome
  if (isBoardFull(board)) return 0; // No winner, board full — draw

  const available = getAvailableMoves(board);

  if (isAiTurn) {
    // ── 2. Maximising (AI's turn) ───────────────────────────────────────────
    // The AI wants the highest possible score, so we start at -Infinity
    // and keep the best (largest) score we find.
    let best = -Infinity;

    for (const move of available) {
      // ── 4. Simulated move ─────────────────────────────────────────────────
      // Place the AI's piece on a copy of the board to try this move.
      board[move] = AI;

      // ── 6. Recursion ──────────────────────────────────────────────────────
      // Recursively ask: "what is the score if play continues from here?"
      // Now it's the human's turn, so isAiTurn flips to false.
      const score = minimax(board, false);

      // ── 5. Undo simulated move ────────────────────────────────────────────
      // Remove the piece so the board is clean for the next candidate move.
      board[move] = null;

      if (score > best) best = score;
    }

    return best;

  } else {
    // ── 3. Minimising (human's turn) ───────────────────────────────────────
    // The human wants the lowest possible score for the AI, so we start at
    // +Infinity and keep the worst (smallest) score for the AI.
    let best = +Infinity;

    for (const move of available) {
      // ── 4. Simulated move ─────────────────────────────────────────────────
      board[move] = HUMAN;

      // ── 6. Recursion ──────────────────────────────────────────────────────
      // Now it's the AI's turn again, so isAiTurn flips to true.
      const score = minimax(board, true);

      // ── 5. Undo simulated move ────────────────────────────────────────────
      board[move] = null;

      if (score < best) best = score;
    }

    return best;
  }
}

/**
 * Finds the best move for the AI by running minimax on every available cell
 * and returning the index with the highest score.
 */
export function getBestMove(board: Board): number {
  let bestScore = -Infinity;
  let bestMove = -1;

  for (const move of getAvailableMoves(board)) {
    // Try placing AI on this cell.
    board[move] = AI;
    // Score what happens from here (human moves next → isAiTurn = false).
    const score = minimax(board, false);
    // Undo the trial move.
    board[move] = null;

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}
