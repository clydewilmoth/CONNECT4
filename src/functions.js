async function putChip(
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
        await setColorBoard(mem);
        await setCurrentPlayer("yellow");
        return [true, row];
      } else {
        let mem = colorBoard;
        mem[row][col] = "yellow";
        await setColorBoard(mem);
        await setCurrentPlayer("red");
        return [true, row];
      }
    }
  }
  return [false, null];
}

function checkWin(row, col, colorBoard, currentPlayer) {
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

function botChoice(colorBoard) {
  while (true) {
    const rand = Math.floor(Math.random() * 7)
    if (colorBoard[0][rand] === "white") {
      return rand;
    }
  }
}

export async function clickHandlerTurn(col, params) {

  const iMax = params.gamemode === 1 ? 2 : 1;

  for (let i = 0; i < iMax; i++) {

    const memCurrentPlayer = params.currentPlayer;

    const botMove = i !== 0 && botChoice(params.colorBoard);

    const [worked, currentChip] = i === 0 ?
      await putChip(
        col,
        params.colorBoard,
        params.currentPlayer,
        params.setColorBoard,
        params.setCurrentPlayer
      ) : await putChip(
        botMove,
        params.colorBoard,
        params.currentPlayer,
        params.setColorBoard,
        params.setCurrentPlayer
      );

    if (worked) {
      await params.setMessage("");

      const actualMove = i === 0 ? col : botMove;

      const win = checkWin(currentChip, actualMove, params.colorBoard, memCurrentPlayer);

      await params.setTurns(params.turns + 1);

      if (win) {
        const mem = i === 1 ? "bot " : "player ";
        await params.setMessage(mem + memCurrentPlayer + " wins!");
        await params.setGameOver(true);
        await params.setCurrentPlayer("red");
        break;

      } else if (params.turns === 42) {
        await params.setMessage("draw!");
        await params.setGameOver(true);
        await params.setCurrentPlayer("red")
        break;
      }
    } else {
      params.setMessage("column is full!");
      break;
    }
  }


}

export function clickHandlerRestart(params) {
  params.setTurns(0);
  params.setGameOver(false);
  params.setColorBoard(Array.from(Array(6), () => new Array(7).fill("white")));
  params.setMessage("");
}

export function clickHandlerGamemode(params, gamemode) {
  params.setMenu(false);
  params.setGamemode(gamemode);
}
