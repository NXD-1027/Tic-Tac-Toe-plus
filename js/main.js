document.addEventListener("DOMContentLoaded", () => {
  const boardElement = document.querySelector("#board");
  const restartButton = document.querySelector("#restart-button");
  const undoButton = document.querySelector("#undo-button");
  const modeSelect = document.querySelector("#mode-select");
  const difficultySelect = document.querySelector("#difficulty-select");

  const { gameState, resetGame, makeMove, undoForCurrentMode } = window.TicTacToeGame;
  const { renderBoard, renderGame } = window.TicTacToeRender;

  if (!boardElement) {
    console.error("Board element was not found.");
    return;
  }

  function syncControlsFromState() {
    if (modeSelect) {
      modeSelect.value = gameState.mode;
    }

    if (difficultySelect) {
      difficultySelect.value = gameState.aiDifficulty;
    }
  }

  function fullRender() {
    renderBoard(boardElement);
    renderGame(gameState);
    syncControlsFromState();
  }

  function resetAndRender() {
    resetGame();
    fullRender();
    console.log("Game reset.");
  }

  fullRender();

  boardElement.addEventListener("click", event => {
    const cell = event.target.closest(".cell");

    if (!cell) return;

    const macroRow = Number(cell.dataset.macroRow);
    const macroCol = Number(cell.dataset.macroCol);
    const microIndex = Number(cell.dataset.microIndex);
    const moved = makeMove(gameState, macroRow, macroCol, microIndex);

    if (!moved) {
      console.log("Invalid move:", { macroRow, macroCol, microIndex });
      return;
    }

    renderGame(gameState);
    console.log("Move made:", { macroRow, macroCol, microIndex });
  });

  restartButton?.addEventListener("click", resetAndRender);

  undoButton?.addEventListener("click", () => {
    const undone = undoForCurrentMode(gameState);

    if (!undone) {
      console.log("Nothing to undo.");
      return;
    }

    renderGame(gameState);
    console.log("Move undone.");
  });

  modeSelect?.addEventListener("change", event => {
    gameState.mode = event.target.value;
    resetAndRender();
    console.log("Mode changed:", gameState.mode);
  });

  difficultySelect?.addEventListener("change", event => {
    gameState.aiDifficulty = event.target.value;
    renderGame(gameState);
    console.log("AI difficulty changed:", gameState.aiDifficulty);
  });
});
