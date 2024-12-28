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

async function checkWin(colorBoard, setColorBoard, currentPlayer) {
  const mem = colorBoard;

  for (let row = 0; row <= 5; row++) {
    for (let col = 0; col <= 6; col++) {
      if (
        row <= 2 &&
        mem[row][col] === currentPlayer &&
        mem[row + 1][col] === currentPlayer &&
        mem[row + 2][col] === currentPlayer &&
        mem[row + 3][col] === currentPlayer
      ) {
        for (let i = 0; i <= 3; i++) {
          mem[row + i][col] = "orange";
        }
        await setColorBoard(mem);
        return true;
      } else if (
        col <= 3 &&
        mem[row][col] === currentPlayer &&
        mem[row][col + 1] === currentPlayer &&
        mem[row][col + 2] === currentPlayer &&
        mem[row][col + 3] === currentPlayer
      ) {
        for (let i = 0; i <= 3; i++) {
          mem[row][col + i] = "orange";
        }
        await setColorBoard(mem);
        return true;
      } else if (
        row <= 2 &&
        col <= 3 &&
        mem[row][col] === currentPlayer &&
        mem[row + 1][col + 1] === currentPlayer &&
        mem[row + 2][col + 2] === currentPlayer &&
        mem[row + 3][col + 3] === currentPlayer
      ) {
        for (let i = 0; i <= 3; i++) {
          mem[row + i][col + i] = "orange";
        }
        await setColorBoard(mem);
        return true;
      } else if (
        row <= 2 &&
        col <= 3 &&
        mem[row][col + 3] === currentPlayer &&
        mem[row + 1][col + 2] === currentPlayer &&
        mem[row + 2][col + 1] === currentPlayer &&
        mem[row + 3][col] === currentPlayer
      ) {
        for (let i = 0; i <= 3; i++) {
          mem[row + i][col + 3 - i] = "orange";
        }
        await setColorBoard(mem);
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

export async function clickHandlerTurn(col, params) {
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
        params.setColorBoard,
        memCurrentPlayer
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
  params.setMessage("");
}
