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
        return [true, row];
      } else {
        let mem = colorBoard;
        mem[row][col] = "yellow";
        setColorBoard(mem);
        setCurrentPlayer("red");
        return [true, row];
      }
    }
  }
  return [false, null];
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

export function clickHandlerTurn(col, params) {
  const [worked, currentChip] = putChip(
    col,
    params.colorBoard,
    params.currentPlayer,
    params.setColorBoard,
    params.setCurrentPlayer
  );
  if (worked) {
    params.setMessage("");
    params.setTurns(params.turns + 1);

    const win = checkWin(currentChip, col, params.colorBoard, params.currentPlayer);

    if (win) {
      params.setMessage(params.currentPlayer + " wins!");
      params.setGameOver(true);

    } else if (params.turns === 42) {
      params.setMessage("draw!");
      params.setGameOver(true);
    }
  } else {
    params.setMessage("column is full!");
  }
}

export function clickHandlerRestart(params) {
  params.setTurns(1);
  params.setGameOver(false);
  params.setColorBoard(Array.from(Array(6), () => new Array(7).fill("white")));
  params.setMessage("");
}
