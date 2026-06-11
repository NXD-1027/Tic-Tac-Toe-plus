function createCell(macroRow, macroCol, microIndex) {
  const cell = document.createElement("button");
  cell.type = "button";
  cell.className = "cell";
  cell.dataset.macroRow = String(macroRow);
  cell.dataset.macroCol = String(macroCol);
  cell.dataset.microIndex = String(microIndex);
  cell.setAttribute(
    "aria-label",
    `大棋盘第 ${macroRow + 1} 行第 ${macroCol + 1} 列，小棋盘格子 ${microIndex + 1}`
  );
  return cell;
}

function createMicroBoard(macroRow, macroCol) {
  const microBoard = document.createElement("section");
  microBoard.className = "micro-board";
  microBoard.dataset.macroRow = String(macroRow);
  microBoard.dataset.macroCol = String(macroCol);
  microBoard.setAttribute(
    "aria-label",
    `第 ${macroRow + 1} 行第 ${macroCol + 1} 列小棋盘`
  );

  for (let microIndex = 0; microIndex < 9; microIndex += 1) {
    microBoard.appendChild(createCell(macroRow, macroCol, microIndex));
  }

  return microBoard;
}

function renderBoard(boardElement) {
  boardElement.innerHTML = "";

  for (let macroRow = 0; macroRow < 3; macroRow += 1) {
    for (let macroCol = 0; macroCol < 3; macroCol += 1) {
      boardElement.appendChild(createMicroBoard(macroRow, macroCol));
    }
  }
}

function formatActiveMicro(activeMicro) {
  if (!activeMicro) {
    return "当前可在任意小棋盘落子";
  }

  return `请在第 ${activeMicro.row + 1} 行第 ${activeMicro.col + 1} 列的小棋盘落子`;
}

function updateStatus(state) {
  const currentPlayerElement = document.querySelector("#current-player");
  const nextBoardHintElement = document.querySelector("#next-board-hint");

  if (currentPlayerElement) {
    currentPlayerElement.textContent = `当前玩家：${state.currentPlayer}`;
  }

  if (nextBoardHintElement) {
    nextBoardHintElement.textContent = formatActiveMicro(state.activeMicro);
  }
}

function updateCells(state) {
  document.querySelectorAll(".cell").forEach(cell => {
    const macroRow = Number(cell.dataset.macroRow);
    const macroCol = Number(cell.dataset.macroCol);
    const microIndex = Number(cell.dataset.microIndex);
    const microBoard = state.macroBoard[macroRow][macroCol];
    const value = microBoard.cells[microIndex];

    cell.textContent = value ?? "";
    cell.classList.toggle("x", value === "X");
    cell.classList.toggle("o", value === "O");
    cell.disabled = !window.TicTacToeGame.isValidMove(state, macroRow, macroCol, microIndex);
    cell.setAttribute(
      "aria-label",
      `大棋盘第 ${macroRow + 1} 行第 ${macroCol + 1} 列，小棋盘格子 ${microIndex + 1}${value ? `，已落子 ${value}` : ""}`
    );
  });
}

function updateMicroBoards(state) {
  document.querySelectorAll(".micro-board").forEach(microBoardElement => {
    const macroRow = Number(microBoardElement.dataset.macroRow);
    const macroCol = Number(microBoardElement.dataset.macroCol);
    const microBoard = state.macroBoard[macroRow][macroCol];
    const isActive = state.activeMicro !== null &&
      state.activeMicro.row === macroRow &&
      state.activeMicro.col === macroCol;
    const isFree = state.activeMicro === null && window.TicTacToeGame.isMicroBoardPlayable(microBoard);
    const isInactive = !isActive && !isFree;

    microBoardElement.classList.toggle("active", isActive);
    microBoardElement.classList.toggle("free", isFree);
    microBoardElement.classList.toggle("inactive", isInactive);
  });
}

function updateControls(state) {
  const undoButton = document.querySelector("#undo-button");

  if (undoButton) {
    undoButton.disabled = state.moveHistory.length === 0;
  }
}

function renderGame(state) {
  updateStatus(state);
  updateMicroBoards(state);
  updateCells(state);
  updateControls(state);
}

window.TicTacToeRender = {
  renderBoard,
  renderGame
};
