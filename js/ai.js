const AI_PLAYER = "O";
const HUMAN_PLAYER = "X";
const CENTER_INDEX = 4;
const CORNER_INDICES = new Set([0, 2, 6, 8]);

function cloneState(state) {
  if (typeof structuredClone === "function") {
    return structuredClone(state);
  }

  return JSON.parse(JSON.stringify(state));
}

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

function simulateMove(state, move, player) {
  const cloned = cloneState(state);
  cloned.currentPlayer = player;
  cloned.isAiThinking = false;

  const moved = window.TicTacToeGame.makeMove(
    cloned,
    move.macroRow,
    move.macroCol,
    move.microIndex
  );

  return moved ? cloned : null;
}

function scoreLinePotential(cells, player, opponent, twoInLineScore, oneInLineScore) {
  let score = 0;

  for (const pattern of [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]) {
    const values = pattern.map(index => cells[index]);
    const hasOpponent = values.some(value => value === opponent || value === "draw");

    if (hasOpponent) continue;

    const playerCount = values.filter(value => value === player).length;
    const emptyCount = values.filter(value => value === null).length;

    if (playerCount === 2 && emptyCount === 1) {
      score += twoInLineScore;
    } else if (playerCount === 1 && emptyCount === 2) {
      score += oneInLineScore;
    }
  }

  return score;
}

function countImmediateWins(state, player, scope) {
  if (state.gameOver) {
    return 0;
  }

  const testState = cloneState(state);
  testState.currentPlayer = player;
  testState.isAiThinking = false;

  return getLegalMoves(testState).reduce((count, move) => {
    const simulated = simulateMove(testState, move, player);

    if (!simulated) {
      return count;
    }

    if (scope === "global" && simulated.winner === player) {
      return count + 1;
    }

    const microBoard = window.TicTacToeGame.getMicroBoard(
      simulated,
      move.macroRow,
      move.macroCol
    );

    if (scope === "local" && microBoard?.winner === player) {
      return count + 1;
    }

    return count;
  }, 0);
}

function scorePosition(move) {
  let score = 0;

  if (move.macroRow === 1 && move.macroCol === 1) {
    score += 120;
  }

  if (
    (move.macroRow === 0 || move.macroRow === 2) &&
    (move.macroCol === 0 || move.macroCol === 2)
  ) {
    score += 45;
  }

  if (move.microIndex === CENTER_INDEX) {
    score += 80;
  } else if (CORNER_INDICES.has(move.microIndex)) {
    score += 35;
  } else {
    score += 12;
  }

  return score;
}

function scoreBoardShape(state, move, aiPlayer, humanPlayer) {
  const microBoard = window.TicTacToeGame.getMicroBoard(
    state,
    move.macroRow,
    move.macroCol
  );
  const globalCells = window.TicTacToeGame.getGlobalCells(state.macroBoard);

  let score = 0;

  if (microBoard?.cells) {
    score += scoreLinePotential(microBoard.cells, aiPlayer, humanPlayer, 180, 25);
    score -= scoreLinePotential(microBoard.cells, humanPlayer, aiPlayer, 220, 30);
  }

  score += scoreLinePotential(globalCells, aiPlayer, humanPlayer, 900, 120);
  score -= scoreLinePotential(globalCells, humanPlayer, aiPlayer, 1100, 140);

  return score;
}

function evaluateMediumMove(state, move, aiPlayer = AI_PLAYER, humanPlayer = HUMAN_PLAYER) {
  const beforeMicroBoard = window.TicTacToeGame.getMicroBoard(
    state,
    move.macroRow,
    move.macroCol
  );
  const simulated = simulateMove(state, move, aiPlayer);

  if (!simulated) {
    return -Infinity;
  }

  let score = 0;
  const afterMicroBoard = window.TicTacToeGame.getMicroBoard(
    simulated,
    move.macroRow,
    move.macroCol
  );

  if (simulated.winner === aiPlayer) {
    return 100000 + scorePosition(move);
  }

  if (simulated.winner === "draw") {
    score += 300;
  }

  if (beforeMicroBoard?.winner === null && afterMicroBoard?.winner === aiPlayer) {
    score += 4500;
  }

  if (beforeMicroBoard?.winner === null && afterMicroBoard?.winner === "draw") {
    score += 180;
  }

  const humanGlobalWins = countImmediateWins(simulated, humanPlayer, "global");
  const humanLocalWins = countImmediateWins(simulated, humanPlayer, "local");

  score -= humanGlobalWins * 20000;
  score -= humanLocalWins * 1100;

  if (simulated.activeMicro === null && !simulated.gameOver) {
    score -= 120;
  }

  score += scorePosition(move);
  score += scoreBoardShape(simulated, move, aiPlayer, humanPlayer);

  return score;
}

function chooseBestScoredMove(scoredMoves) {
  const bestScore = Math.max(...scoredMoves.map(item => item.score));
  const bestMoves = scoredMoves.filter(item => item.score === bestScore);
  const randomIndex = Math.floor(Math.random() * bestMoves.length);

  return bestMoves[randomIndex].move;
}

function getMediumMove(state, aiPlayer = AI_PLAYER, humanPlayer = HUMAN_PLAYER) {
  const legalMoves = getLegalMoves(state);

  if (legalMoves.length === 0) {
    return null;
  }

  const scoredMoves = legalMoves.map(move => ({
    move,
    score: evaluateMediumMove(state, move, aiPlayer, humanPlayer)
  }));

  return chooseBestScoredMove(scoredMoves);
}

function getAiMove(state) {
  if (state.aiDifficulty === "medium") {
    return getMediumMove(state);
  }

  return getRandomMove(state);
}

window.TicTacToeAI = {
  getLegalMoves,
  getRandomMove,
  getMediumMove,
  getAiMove
};
