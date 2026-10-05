import type { Board, Player } from "../game";
import { HUMAN, AI } from "../game";
import type { GamePhase } from "../useGameController";
import "./game-view.css";

type GameViewProps = {
  board: Board;
  phase: GamePhase;
  winningLine: number[] | null;
  isCellPlayable: (index: number) => boolean;
  onCellClick: (index: number) => void;
  onReset: () => void;
};

function statusLabel(phase: GamePhase): string {
  switch (phase.kind) {
    case "playing":
      return phase.turn === "human" ? "Your move" : "Minimax is choosing…";
    case "won":
      return phase.winner === HUMAN ? "You took the line." : "Minimax took the line.";
    case "draw":
      return "Board full — stalemate.";
  }
}

function Mark({ player }: { player: Player }) {
  return (
    <span className={`mark mark--${player === HUMAN ? "x" : "o"}`} aria-hidden>
      {player}
    </span>
  );
}

export function GameView({
  board,
  phase,
  winningLine,
  isCellPlayable,
  onCellClick,
  onReset,
}: GameViewProps) {
  const winSet = winningLine ? new Set(winningLine) : null;
  const thinking = phase.kind === "playing" && phase.turn === "ai";

  return (
    <div className="shell">
      <header className="masthead">
        <p className="eyebrow">Human vs minimax</p>
        <h1 className="title">Tic-Tac-Toe</h1>
        <p className="players">
          You <Mark player={HUMAN} /> · Machine <Mark player={AI} />
        </p>
      </header>

      <p className={`status ${thinking ? "status--pulse" : ""}`} role="status">
        {statusLabel(phase)}
      </p>

      <div className="board" role="grid" aria-label="Game board">
        {board.map((cell, index) => {
          const playable = isCellPlayable(index);
          const highlighted = winSet?.has(index) ?? false;

          return (
            <button
              key={index}
              type="button"
              className={[
                "cell",
                cell === HUMAN ? "cell--x" : cell === AI ? "cell--o" : "",
                highlighted ? "cell--win" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => onCellClick(index)}
              disabled={!playable && cell === null}
              aria-label={`Cell ${index + 1}${cell ? `: ${cell}` : ": empty"}`}
            >
              {cell ? <Mark player={cell} /> : null}
            </button>
          );
        })}
      </div>

      <button type="button" className="reset" onClick={onReset}>
        New board
      </button>

      <footer className="credit">
        <span className="credit__name">Tahsin</span>
      </footer>
    </div>
  );
}
