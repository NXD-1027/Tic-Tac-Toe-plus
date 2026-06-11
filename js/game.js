function createMicroBoard() {
  return {
    cells: Array(9).fill(null),
    winner: null
  };
}

function createInitialState() {
  return {
    macroBoard: Array.from({ length: 3 }, () =>
      Array.from({ length: 3 }, () => createMicroBoard())
    ),
    currentPlayer: "X",
    activeMicro: null,
    gameOver: false,
    winner: null,
    moveHistory: [],
    mode: "local",
    aiDifficulty: "easy"
  };
}

const gameState = createInitialState();

function resetGame() {
  Object.assign(gameState, createInitialState());
}

window.TicTacToeGame = {
  gameState,
  createInitialState,
  resetGame
};
