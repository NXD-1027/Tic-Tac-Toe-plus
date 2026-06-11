document.addEventListener("DOMContentLoaded", () => {
  const boardElement = document.querySelector("#board");
  const restartButton = document.querySelector("#restart-button");
  const modeSelect = document.querySelector("#mode-select");
  const difficultySelect = document.querySelector("#difficulty-select");

  const { gameState, resetGame } = window.TicTacToeGame;
  const { renderBoard, renderGame } = window.TicTacToeRender;

  if (!boardElement) {
    console.error("Board element was not found.");
    return;
  }

  renderBoard(boardElement);
  renderGame(gameState);

  boardElement.addEventListener("click", event => {
    const cell = event.target.closest(".cell");

    if (!cell) return;

    const macroRow = Number(cell.dataset.macroRow);
    const macroCol = Number(cell.dataset.macroCol);
    const microIndex = Number(cell.dataset.microIndex);

    console.log("Cell clicked:", { macroRow, macroCol, microIndex });
  });

  restartButton?.addEventListener("click", () => {
    resetGame();
    renderGame(gameState);
    console.log("Game reset.");
  });

  modeSelect?.addEventListener("change", event => {
    gameState.mode = event.target.value;
    console.log("Mode changed:", gameState.mode);
  });

  difficultySelect?.addEventListener("change", event => {
    gameState.aiDifficulty = event.target.value;
    console.log("AI difficulty changed:", gameState.aiDifficulty);
  });
});
