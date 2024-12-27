import { useState } from "react";
import { checkWin, putChip } from "./fns";

let [getColorBoard, setColorBoard] = [null, null];
let [getGameOver, setGameOver] = [null, null];
let [getCurrentPlayer, setCurrentPlayer] = [null, null];
let [getMessage, setMessage] = [null, null];

export default function App() {
  const [colorBoard, sColorBoard] = useState(
    Array.from(Array(6), () => new Array(7).fill("white"))
  );
  getColorBoard = colorBoard;
  setColorBoard = sColorBoard;

  const [gameOver, sGameOver] = useState(false);
  getGameOver = gameOver;
  setGameOver = sGameOver;

  const [currentPlayer, sCurrentPlayer] = useState("red");
  getCurrentPlayer = currentPlayer;
  setCurrentPlayer = sCurrentPlayer;

  const [message, sMessage] = useState("");
  getMessage = message;
  setMessage = sMessage;

  return (
    <>
      <h1>CONNECT4</h1>
      <Board />
      <p>{getMessage}</p>
    </>
  );
}

function Field({ row, col, backgroundColor, disabled }) {
  return (
    <button
      className="field"
      row={row}
      col={col}
      style={backgroundColor}
      onClick={() => {
        let currentChip = putChip(
          col,
          getColorBoard,
          getCurrentPlayer,
          setColorBoard,
          setCurrentPlayer
        );

        let win = checkWin(currentChip, col, getColorBoard, getCurrentPlayer);

        if (win) {
          setMessage(getCurrentPlayer + " wins!");
          setGameOver(true);
        }
      }}
      disabled={disabled}
    >
      &nbsp;
    </button>
  );
}

function Board() {
  var fields = getColorBoard.map((subarr, row) =>
    subarr.map((color, col) => {
      return (
        <Field
          key={row.toString() + col.toString()}
          row={row}
          col={col}
          backgroundColor={{ backgroundColor: color }}
          disabled={row === 0 ? getGameOver : true}
        />
      );
    })
  );

  return (
    <div className="board">
      {fields.map((subarr) => subarr.map((field) => field))}
    </div>
  );
}
