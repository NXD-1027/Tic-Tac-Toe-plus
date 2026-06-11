function getLegalMoves(state) {
  const moves = [];
  const { isValidMove } = window.TicTacToeGame;

  for (let macroRow = 0; macroRow < 3; macroRow += 1) {
    for (let macroCol = 0; macroCol < 3; macroCol += 1) {
      for (let microIndex = 0; microIndex < 9; microIndex += 1) {
        if (isValidMove(state, macroRow, macroCol, microIndex)) {
          moves.push({ macroRow, macroCol, microIndex });
        }
      }
    }
  }

  return moves;
}

function getRandomMove(state) {
  const legalMoves = getLegalMoves(state);

  if (legalMoves.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * legalMoves.length);
  return legalMoves[randomIndex];
}

function getAiMove(state) {
  // v0.5.1 only implements simple random AI.
  // The medium strategy will be added in v0.5.2.
  return getRandomMove(state);
}

window.TicTacToeAI = {
  getLegalMoves,
  getRandomMove,
  getAiMove
};
