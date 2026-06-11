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

function updateStatus(state) {
  const currentPlayerElement = document.querySelector("#current-player");
  const nextBoardHintElement = document.querySelector("#next-board-hint");

  if (currentPlayerElement) {
    currentPlayerElement.textContent = `当前玩家：${state.currentPlayer}`;
  }

  if (nextBoardHintElement) {
    nextBoardHintElement.textContent = "当前可在任意小棋盘落子";
  }
}

function renderGame(state) {
  updateStatus(state);
}

window.TicTacToeRender = {
  renderBoard,
  renderGame
};
