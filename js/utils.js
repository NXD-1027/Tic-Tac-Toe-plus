function microIndexToRowCol(index) {
  return {
    row: Math.floor(index / 3),
    col: index % 3
  };
}

function rowColToMicroIndex(row, col) {
  return row * 3 + col;
}

window.TicTacToeUtils = {
  microIndexToRowCol,
  rowColToMicroIndex
};
