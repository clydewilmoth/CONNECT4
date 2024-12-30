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

export async function clickHandlerTurn(self, col) {
  const iMax = self.gamemode === 1 ? 2 : 1;

  for (let i = 0; i < iMax; i++) {
    const memCurrentPlayer = self.currentPlayer;

    const worked =
      i === 0
        ? await putChip(
            col,
            self.colorBoard,
            self.currentPlayer,
            self.setColorBoard,
            self.setCurrentPlayer
          )
        : await putChip(
            botChoice(self.colorBoard),
            self.colorBoard,
            self.currentPlayer,
            self.setColorBoard,
            self.setCurrentPlayer
          );

    if (worked) {
      await self.setMessage("");

      const win = await checkWin(
        self.colorBoard,
        memCurrentPlayer,
        self.outlineBoard,
        self.setOutlineBoard
      );

      await self.setTurnsMem(col + self.turnsMem);
      await self.setTurns(self.turns + 1);

      if (win) {
        const mem = i === 1 ? "bot " : "player ";
        await self.setMessage(mem + memCurrentPlayer + " wins!");
        await self.setGameOver(true);
        break;
      } else if (self.turns === 42) {
        await self.setMessage("draw!");
        await self.setGameOver(true);
        break;
      }
    } else {
      self.setMessage("column is full!");
      break;
    }
  }

  if (self.gamemode === 2) {
    await self.setBoardDecimal(sepToDec(self.turnsMem).toString());
  }
}

export async function clickHandlerRestart(self) {
  await self.setTurns(0);
  await self.setGameOver(false);
  await self.setCurrentPlayer("red");
  await self.setColorBoard(
    Array.from(Array(6), () => new Array(7).fill("white"))
  );
  await self.setOutlineBoard(
    Array.from(Array(6), () => new Array(7).fill("0px solid black"))
  );
  await self.setMessage("");
  await self.setTurnsMem("");
  await self.setBoardDecimal("");
  await self.setInputDecimal("");
}

export async function clickHandlerGamemode(self, gamemode) {
  await self.setMenu(false);
  await self.setGamemode(gamemode);
}

export async function clickHandlerReturn(self) {
  await self.setMenu(true);
  await self.setTurns(0);
  await self.setGameOver(false);
  await self.setCurrentPlayer("red");
  await self.setColorBoard(
    Array.from(Array(6), () => new Array(7).fill("white"))
  );
  await self.setOutlineBoard(
    Array.from(Array(6), () => new Array(7).fill("0px solid black"))
  );
  await self.setMessage("");
  await self.setTurnsMem("");
  await self.setBoardDecimal("");
  await self.setInputDecimal("");
}

export async function clickHandlerLoadBoard(self, dec) {
  let sep = decToSep(dec);
  await clickHandlerRestart(self);

  while (sep.length) {
    await clickHandlerTurn(self, sep[sep.length - 1]);
    sep = sep.slice(0, -1);
  }
}

export async function clickHandlerCopyClipboard(self) {
  navigator.clipboard.writeText(self.boardDecimal);
  self.setShowCopy(true);
  setTimeout(() => {
    self.setShowCopy(false);
  }, 1500);
}

function sepToDec(sep) {
  let res = 0n;
  let ind = 0n;
  let mem = sep.split("").reverse().join("");
  while (ind < mem.length) {
    res = BigInt(7n ** ind * BigInt(mem[ind])) + res;
    ind++;
  }
  res = BigInt(7n ** ind) + res;

  return res;
}

function decToSep(dec) {
  let mem = BigInt(dec);
  let res = "";

  while (mem > 0n) {
    res = (mem % 7n).toString() + res;
    mem = mem / 7n;
  }
  res = res.slice(1, res.length);

  return res;
}
