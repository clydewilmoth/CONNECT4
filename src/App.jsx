import { useState } from "react";
import { clickHandlerTurn, clickHandlerRestart, clickHandlerGamemode } from "./functions";

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

  const [turns, setTurns] = useState(0);
  params.turns = turns;
  params.setTurns = setTurns;

  const [menu, setMenu] = useState(true);
  params.menu = menu;
  params.setMenu = setMenu;

  const [gamemode, setGamemode] = useState(0);
  params.gamemode = gamemode;
  params.setGamemode = setGamemode;


  return (
    <>
      <Heading />
      <Gamemode />
      <Board />
      <Restart />
      <Message />
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
      onClick={() => clickHandlerTurn(col, params)}
      disabled={disabled}
    >
      &nbsp;
    </button>
  );
}

function Board() {
  let fields = params.colorBoard.map((subarr, row) =>
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

  const displayMem = params.menu ? "none" : "";

  return (
    <div className="board" style={{ display: displayMem }}>
      {fields.map((subarr) => subarr.map((field) => field))}
    </div>
  );
}

function Restart() {
  return (< button className="restart" hidden={!params.gameOver} onClick={() => clickHandlerRestart(params)}>
    &#8634;
  </button >);
}

function Gamemode() {
  return <div className="gamemode-div" hidden={!params.menu}>
    <button className="gamemode-button" onClick={() => clickHandlerGamemode(params, 1)}>
      singleplayer
    </button>
    <br />
    <button className="gamemode-button" onClick={() => clickHandlerGamemode(params, 2)}>
      multiplayer
    </button>
  </div>
}

function Message() {
  const displayMem = params.menu ? "none" : "";
  return <p className="message" style={{ display: displayMem }}>
    {params.message}
  </p>
}

function Heading() {
  const displayMem = !params.menu ? "none" : "";
  return <h1 className="heading" style={{ display: displayMem }}>
    CONNECT4
  </h1>
}