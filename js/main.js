document.addEventListener("DOMContentLoaded", () => {
  const boardElement = document.querySelector("#board");
  const restartButton = document.querySelector("#restart-button");
  const undoButton = document.querySelector("#undo-button");
  const modeSelect = document.querySelector("#mode-select");
  const difficultySelect = document.querySelector("#difficulty-select");

  const { gameState, resetGame, makeMove, undoForCurrentMode } = window.TicTacToeGame;
  const { renderBoard, renderGame } = window.TicTacToeRender;
  const { getAiMove } = window.TicTacToeAI;
  let aiTimer = null;

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

  function clearAiTimer() {
    if (aiTimer !== null) {
      clearTimeout(aiTimer);
      aiTimer = null;
    }
  }

  function resetAndRender() {
    clearAiTimer();
    resetGame();
    fullRender();
    console.log("Game reset.");
  }

  function shouldAiMove() {
    return gameState.mode === "ai" &&
      !gameState.gameOver &&
      gameState.currentPlayer === "O";
  }

  function maybeTriggerAiMove() {
    if (!shouldAiMove()) {
      return;
    }

    clearAiTimer();
    gameState.isAiThinking = true;
    renderGame(gameState);

    aiTimer = setTimeout(() => {
      aiTimer = null;

      if (!shouldAiMove()) {
        gameState.isAiThinking = false;
        renderGame(gameState);
        return;
      }

      const move = getAiMove(gameState);

      if (move) {
        makeMove(gameState, move.macroRow, move.macroCol, move.microIndex);
        console.log("AI move made:", move);
      }

      gameState.isAiThinking = false;
      renderGame(gameState);
    }, 350);
  }

  fullRender();

  boardElement.addEventListener("click", event => {
    if (gameState.isAiThinking) {
      return;
    }

    if (gameState.mode === "ai" && gameState.currentPlayer !== "X") {
      return;
    }

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
    maybeTriggerAiMove();
  });

  restartButton?.addEventListener("click", resetAndRender);

  undoButton?.addEventListener("click", () => {
    clearAiTimer();
    gameState.isAiThinking = false;
    const undone = undoForCurrentMode(gameState);

    if (!undone) {
      console.log("Nothing to undo.");
      renderGame(gameState);
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
