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
        return true;
      } else {
        let mem = colorBoard;
        mem[row][col] = "yellow";
        await setColorBoard(mem);
        await setCurrentPlayer("red");
        return true;
      }
    }
  }
  return false;
}

async function checkWin(
  colorBoard,
  currentPlayer,
  outlineBoard,
  setOutlineBoard
) {
  const memOutlineBoard = outlineBoard;

  for (let row = 0; row <= 5; row++) {
    for (let col = 0; col <= 6; col++) {
      if (
        row <= 2 &&
        colorBoard[row][col] === currentPlayer &&
        colorBoard[row + 1][col] === currentPlayer &&
        colorBoard[row + 2][col] === currentPlayer &&
        colorBoard[row + 3][col] === currentPlayer
      ) {
        for (let i = 0; i <= 3; i++) {
          memOutlineBoard[row + i][col] = "7px outset black";
        }
        await setOutlineBoard(memOutlineBoard);
        return true;
      } else if (
        col <= 3 &&
        colorBoard[row][col] === currentPlayer &&
        colorBoard[row][col + 1] === currentPlayer &&
        colorBoard[row][col + 2] === currentPlayer &&
        colorBoard[row][col + 3] === currentPlayer
      ) {
        for (let i = 0; i <= 3; i++) {
          memOutlineBoard[row][col + i] = "7px outset black";
        }
        await setOutlineBoard(memOutlineBoard);
        return true;
      } else if (
        row <= 2 &&
        col <= 3 &&
        colorBoard[row][col] === currentPlayer &&
        colorBoard[row + 1][col + 1] === currentPlayer &&
        colorBoard[row + 2][col + 2] === currentPlayer &&
        colorBoard[row + 3][col + 3] === currentPlayer
      ) {
        for (let i = 0; i <= 3; i++) {
          memOutlineBoard[row + i][col + i] = "7px outset black";
        }
        await setOutlineBoard(memOutlineBoard);
        return true;
      } else if (
        row <= 2 &&
        col <= 3 &&
        colorBoard[row][col + 3] === currentPlayer &&
        colorBoard[row + 1][col + 2] === currentPlayer &&
        colorBoard[row + 2][col + 1] === currentPlayer &&
        colorBoard[row + 3][col] === currentPlayer
      ) {
        for (let i = 0; i <= 3; i++) {
          memOutlineBoard[row + i][col + 3 - i] = "7px outset black";
        }
        await setOutlineBoard(memOutlineBoard);
        return true;
      }
    }
  }

  return false;
}

function botChoice(colorBoard) {
  while (true) {
    const rand = Math.floor(Math.random() * 7);
    if (colorBoard[0][rand] === "white") {
      return rand;
    }
  }
}

export function colFull(col, colorBoard) {
  for (let row = 5; row >= 0; row--) {
    if (colorBoard[row][col] === "white") {
      return false;
    } else {
      return true;
    }
  }
}

export async function clickHandlerTurn(params, col) {
  const iMax = params.gamemode === 1 ? 2 : 1;

  for (let i = 0; i < iMax; i++) {
    const memCurrentPlayer = params.currentPlayer;

    const worked =
      i === 0
        ? await putChip(
            col,
            params.colorBoard,
            params.currentPlayer,
            params.setColorBoard,
            params.setCurrentPlayer
          )
        : await putChip(
            botChoice(params.colorBoard),
            params.colorBoard,
            params.currentPlayer,
            params.setColorBoard,
            params.setCurrentPlayer
          );

    if (worked) {
      await params.setMessage("");

      const win = await checkWin(
        params.colorBoard,
        memCurrentPlayer,
        params.outlineBoard,
        params.setOutlineBoard
      );

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
        await params.setCurrentPlayer("red");
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
  params.setOutlineBoard(
    Array.from(Array(6), () => new Array(7).fill("0px solid black"))
  );
  params.setMessage("");
}

export function clickHandlerGamemode(params, gamemode) {
  params.setMenu(false);
  params.setGamemode(gamemode);
}

export function clickHandlerReturn(params) {
  params.setMenu(true);
  params.setTurns(0);
  params.setGameOver(false);
  params.setColorBoard(Array.from(Array(6), () => new Array(7).fill("white")));
  params.setOutlineBoard(
    Array.from(Array(6), () => new Array(7).fill("0px solid black"))
  );
  params.setMessage("");
}
