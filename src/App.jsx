import { useState } from "react";
import { clickHandler } from "./functions";

let params = {};

export default function App() {
  const [colorBoard, setColorBoard] = useState(
    Array.from(Array(6), () => new Array(7).fill("white"))
  );
  params.colorBoard = colorBoard;
  params.setColorBoard = setColorBoard;

  const [gameOver, setGameOver] = useState(false);
  params.gameOver = gameOver;
  params.setGameOver = setGameOver;

  const [currentPlayer, setCurrentPlayer] = useState("red");
  params.currentPlayer = currentPlayer;
  params.setCurrentPlayer = setCurrentPlayer;

  const [message, setMessage] = useState("");
  params.message = message;
  params.setMessage = setMessage;

  const [turns, setTurns] = useState(1);
  params.turns = turns;
  params.setTurns = setTurns;



  return (
    <>
      <h1>CONNECT4</h1>
      <Board />
      <p>{params.message}</p>
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
      onClick={() => clickHandler(col, params)}
      disabled={disabled}
    >
      &nbsp;
    </button>
  );
}

function Board() {
  var fields = params.colorBoard.map((subarr, row) =>
    subarr.map((color, col) => {
      return (
        <Field
          key={row.toString() + col.toString()}
          row={row}
          col={col}
          backgroundColor={{ backgroundColor: color }}
          disabled={row === 0 ? params.gameOver : true}
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
