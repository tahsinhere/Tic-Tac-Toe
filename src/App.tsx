import { useGameController } from "./useGameController";
import { GameView } from "./ui/GameView";

export default function App() {
  const game = useGameController();

  return (
    <GameView
      board={game.board}
      phase={game.phase}
      winningLine={game.winningLine}
      isCellPlayable={game.isCellPlayable}
      onCellClick={game.playCell}
      onReset={game.reset}
    />
  );
}
