export function putChip(
  col,
  colorBoard,
  currentPlayer,
  setColorBoard,
  setCurrentPlayer
) {
  for (let row = 5; row >= 0; row--) {
    if (colorBoard[row][col] === "white") {
      if (currentPlayer === "red") {
        let mem = colorBoard;
        mem[row][col] = "red";
        setColorBoard(mem);
        setCurrentPlayer("yellow");
        return row;
      } else {
        let mem = colorBoard;
        mem[row][col] = "yellow";
        setColorBoard(mem);
        setCurrentPlayer("red");
        return row;
      }
    }
  }
}

export function checkWin(row, col, colorBoard, currentPlayer) {
  if (
    (row <= 2 &&
      colorBoard[row][col] === currentPlayer &&
      colorBoard[row + 1][col] === currentPlayer &&
      colorBoard[row + 2][col] === currentPlayer &&
      colorBoard[row + 3][col] === currentPlayer) ||
    (col <= 3 &&
      colorBoard[row][col] === currentPlayer &&
      colorBoard[row][col + 1] === currentPlayer &&
      colorBoard[row][col + 2] === currentPlayer &&
      colorBoard[row][col + 3] === currentPlayer) ||
    (row >= 3 &&
      colorBoard[row][col] === currentPlayer &&
      colorBoard[row - 1][col] === currentPlayer &&
      colorBoard[row - 2][col] === currentPlayer &&
      colorBoard[row - 3][col] === currentPlayer) ||
    (col >= 3 &&
      colorBoard[row][col] === currentPlayer &&
      colorBoard[row][col - 1] === currentPlayer &&
      colorBoard[row][col - 2] === currentPlayer &&
      colorBoard[row][col - 3] === currentPlayer) ||
    (row <= 2 &&
      col <= 3 &&
      colorBoard[row][col] === currentPlayer &&
      colorBoard[row + 1][col + 1] === currentPlayer &&
      colorBoard[row + 2][col + 2] === currentPlayer &&
      colorBoard[row + 3][col + 3] === currentPlayer) ||
    (row >= 3 &&
      col >= 3 &&
      colorBoard[row][col] === currentPlayer &&
      colorBoard[row - 1][col - 1] === currentPlayer &&
      colorBoard[row - 2][col - 2] === currentPlayer &&
      colorBoard[row - 3][col - 3] === currentPlayer) ||
    (row <= 2 &&
      col >= 3 &&
      colorBoard[row][col] === currentPlayer &&
      colorBoard[row + 1][col - 1] === currentPlayer &&
      colorBoard[row + 2][col - 2] === currentPlayer &&
      colorBoard[row + 3][col - 3] === currentPlayer) ||
    (row >= 3 &&
      col <= 3 &&
      colorBoard[row][col] === currentPlayer &&
      colorBoard[row - 1][col + 1] === currentPlayer &&
      colorBoard[row - 2][col + 2] === currentPlayer &&
      colorBoard[row - 3][col + 3] === currentPlayer)
  ) {
    return true;
  } else {
    return false;
  }
}
