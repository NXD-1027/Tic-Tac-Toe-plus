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

function getMicroBoard(state, macroRow, macroCol) {
  return state.macroBoard?.[macroRow]?.[macroCol] ?? null;
}

function isMicroBoardPlayable(microBoard) {
  return Boolean(
    microBoard &&
    microBoard.winner === null &&
    microBoard.cells.some(cell => cell === null)
  );
}

function isValidMove(state, macroRow, macroCol, microIndex) {
  if (state.gameOver) return false;

  const microBoard = getMicroBoard(state, macroRow, macroCol);

  if (!microBoard) return false;
  if (microIndex < 0 || microIndex > 8) return false;
  if (!isMicroBoardPlayable(microBoard)) return false;
  if (microBoard.cells[microIndex] !== null) return false;

  if (state.activeMicro !== null) {
    return (
      state.activeMicro.row === macroRow &&
      state.activeMicro.col === macroCol
    );
  }

  return true;
}

function getNextActiveMicro(state, microIndex) {
  const row = Math.floor(microIndex / 3);
  const col = microIndex % 3;
  const targetBoard = getMicroBoard(state, row, col);

  if (isMicroBoardPlayable(targetBoard)) {
    return { row, col };
  }

  return null;
}

function makeMove(state, macroRow, macroCol, microIndex) {
  if (!isValidMove(state, macroRow, macroCol, microIndex)) {
    return false;
  }

  const microBoard = getMicroBoard(state, macroRow, macroCol);

  state.moveHistory.push({
    macroRow,
    macroCol,
    microIndex,
    player: state.currentPlayer,
    previousActiveMicro: state.activeMicro,
    previousMicroWinner: microBoard.winner,
    previousGameWinner: state.winner,
    previousGameOver: state.gameOver
  });

  microBoard.cells[microIndex] = state.currentPlayer;
  state.activeMicro = getNextActiveMicro(state, microIndex);
  state.currentPlayer = state.currentPlayer === "X" ? "O" : "X";

  return true;
}

window.TicTacToeGame = {
  gameState,
  createInitialState,
  resetGame,
  getMicroBoard,
  isMicroBoardPlayable,
  isValidMove,
  getNextActiveMicro,
  makeMove
};
