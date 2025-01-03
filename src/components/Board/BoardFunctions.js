const putChip = async (
  col,
  colorBoard,
  currentPlayer,
  setColorBoard,
  setCurrentPlayer
) => {
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
};

const checkWin = async (
  colorBoard,
  currentPlayer,
  outlineBoard,
  setOutlineBoard
) => {
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
};

const botChoice = (colorBoard) => {
  while (true) {
    const rand = Math.floor(Math.random() * 7);
    if (colorBoard[0][rand] === "white") {
      return rand;
    }
  }
};

const sepToDec = (sep) => {
  let res = 0n;
  let ind = 0n;
  let mem = sep.split("").reverse().join("");
  while (ind < mem.length) {
    res = BigInt(7n ** ind * BigInt(mem[ind])) + res;
    ind++;
  }
  res = BigInt(7n ** ind) + res;

  return res;
};

const decToSep = (dec) => {
  let mem = BigInt(dec);
  let res = "";

  while (mem > 0n) {
    res = (mem % 7n).toString() + res;
    mem = mem / 7n;
  }
  res = res.slice(1, res.length);

  return res;
};

export const clickHandlerTurn = async (self, col, winStringPrefix) => {
  const memCurrentPlayer = self.currentPlayer;

  const worked = await putChip(
    col,
    self.colorBoard,
    self.currentPlayer,
    self.setColorBoard,
    self.setCurrentPlayer
  );

  if (worked) {
    await self.setMessage(
      self.gameMode === 2 ? self.currentPlayer + "'s turn" : ""
    );

    const win = await checkWin(
      self.colorBoard,
      memCurrentPlayer,
      self.outlineBoard,
      self.setOutlineBoard
    );

    await self.setTurnsMem(col + self.turnsMem);
    await self.setTurns(self.turns + 1);

    if (win) {
      await self.setMessage(
        self.gameMode === 1
          ? winStringPrefix + " " + " wins!"
          : winStringPrefix + " " + memCurrentPlayer + " wins!"
      );
      await self.setGameOver(true);
    } else if (self.turns === 42) {
      await self.setMessage("draw!");
      await self.setGameOver(true);
    }
    await self.setBoardDecimal(sepToDec(self.turnsMem).toString());
    const memTurnsDisplay = self.turnsDisplay;
    memTurnsDisplay.push(self.boardDecimal);
    await self.setTurnsDisplay(memTurnsDisplay);
    return true;
  } else {
    self.setMessage("column is full!");
    return false;
  }
};

export const clickHandlerPlayerTurn = async (self, col) => {
  return await clickHandlerTurn(self, col, "player");
};

export const clickHandlerBotTurn = async (self, col, random) => {
  let botCol = 0;
  if (random) {
    botCol = botChoice(self.colorBoard);
  } else {
    botCol = col;
  }
  return await clickHandlerTurn(self, botCol, "bot");
};

export const clickHandlerRestart = async (self, autoPut) => {
  await self.setGameOver(false);
  await self.setCurrentPlayer("red");
  await self.setColorBoard(
    Array.from(Array(6), () => new Array(7).fill("white"))
  );
  await self.setOutlineBoard(
    Array.from(Array(6), () => new Array(7).fill("0px solid black"))
  );
  await self.setMessage("red's turn");
  await self.setTurns(0);
  await self.setTurnsMem("");
  await self.setTurnsDisplay([]);
  await self.setBoardDecimal("");
  await self.setInputDecimal("");
  if (self.gameMode === 1 && autoPut) {
    await clickHandlerBotTurn(self, 0, true);
  }
};

export const clickHandlerReturn = async (self) => {
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
  await self.setTurnsDisplay([]);
  await self.setBoardDecimal("");
  await self.setInputDecimal("");
};

export const clickHandlerLoadBoard = async (self, dec) => {
  let sep = "";

  try {
    sep = decToSep(dec);
  } catch {
    await clickHandlerRestart(self, false);
    if (self.gameMode === 1) {
      await clickHandlerBotTurn(self, 0, true);
    }
    return;
  }

  await clickHandlerRestart(self, false);

  while (sep.length) {
    if (sep.length % 2 != 0) {
      await clickHandlerPlayerTurn(self, sep[sep.length - 1]);
      sep = sep.slice(0, -1);
    } else {
      await clickHandlerBotTurn(self, sep[sep.length - 1], false);
      sep = sep.slice(0, -1);
    }
  }
  if (self.gameMode === 1 && self.currentPlayer === "red" && !self.gameOver) {
    await clickHandlerBotTurn(self, 0, true);
  }
};

export const clickHandlerCopyClipboard = async (self) => {
  navigator.clipboard.writeText(self.boardDecimal);
  self.setShowCopy(true);
  setTimeout(() => {
    self.setShowCopy(false);
  }, 1000);
};
