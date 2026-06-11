const WIN_PATTERNS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function createStateMicroBoard() {
  return {
    cells: Array(9).fill(null),
    winner: null
  };
}

function createInitialState() {
  return {
    macroBoard: Array.from({ length: 3 }, () =>
      Array.from({ length: 3 }, () => createStateMicroBoard())
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
  const freshState = createInitialState();
  const previousMode = gameState.mode;
  const previousDifficulty = gameState.aiDifficulty;

  Object.assign(gameState, freshState, {
    mode: previousMode,
    aiDifficulty: previousDifficulty
  });
}

function getMicroBoard(state, macroRow, macroCol) {
  return state.macroBoard?.[macroRow]?.[macroCol] ?? null;
}

function isMicroBoardPlayable(microBoard) {
  return Boolean(
    microBoard &&
    Array.isArray(microBoard.cells) &&
    microBoard.winner === null &&
    microBoard.cells.some(cell => cell === null)
  );
}

function checkWinner(cells) {
  for (const pattern of WIN_PATTERNS) {
    const [a, b, c] = pattern;
    const value = cells[a];

    if (value && value !== "draw" && value === cells[b] && value === cells[c]) {
      return value;
    }
  }

  if (cells.every(Boolean)) {
    return "draw";
  }

  return null;
}

function getGlobalCells(macroBoard) {
  return macroBoard.flat().map(microBoard => microBoard.winner);
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
  microBoard.winner = checkWinner(microBoard.cells);

  const globalWinner = checkWinner(getGlobalCells(state.macroBoard));

  if (globalWinner) {
    state.winner = globalWinner;
    state.gameOver = true;
    state.activeMicro = null;
    return true;
  }

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
  checkWinner,
  getGlobalCells,
  isValidMove,
  getNextActiveMicro,
  makeMove
};
