import { useState } from "react";
import {
  clickHandlerTurn,
  clickHandlerRestart,
  clickHandlerGamemode,
  clickHandlerReturn,
} from "./functions";

const params = {};

export default function App() {
  const [colorBoard, setColorBoard] = useState(
    Array.from(Array(6), () => new Array(7).fill("white"))
  );
  params.colorBoard = colorBoard;
  params.setColorBoard = setColorBoard;

  const [outlineBoard, setOutlineBoard] = useState(
    Array.from(Array(6), () => new Array(7).fill("0px solid black"))
  );
  params.outlineBoard = outlineBoard;
  params.setOutlineBoard = setOutlineBoard;

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
      <Message />
    </>
  );
}

function Field({ row, col, style, disabled }) {
  const [pointer, setPointer] = useState(false);
  const [hoverColor, setHoverColor] = useState("white");

  const styling = {
    backgroundColor: !pointer
      ? style.backgroundColor
      : params.currentPlayer === "red" && row === 0
      ? hoverColor
      : params.currentPlayer === "yellow" && row === 0 && hoverColor,
    cursor: pointer && "pointer",
    outlineWidth: style.outlineWidth,
    outlineColor: style.outlineColor,
    outlineStyle: style.outlineStyle,
  };

  return (
    <button
      className="field"
      row={row}
      col={col}
      style={styling}
      onClick={async () => {
        await clickHandlerTurn(params, col);
        if (params.gamemode === 2) {
          params.currentPlayer === "red"
            ? setHoverColor("hsla(0, 100%, 80%, 1)")
            : setHoverColor("hsla(60, 100%, 80%, 1)");
        }
      }}
      disabled={disabled}
      onMouseEnter={() => {
        if (!disabled) {
          setPointer(!params.gameOver);
        }
        params.currentPlayer === "red"
          ? setHoverColor("hsla(0, 100%, 80%, 1)")
          : setHoverColor("hsla(60, 100%, 80%, 1)");
      }}
      onMouseLeave={() => {
        setHoverColor(style.backgroundColor);
        setPointer(false);
      }}
    >
      &nbsp;
    </button>
  );
}

function Board() {
  const fields = params.colorBoard.map((subarr, row) =>
    subarr.map((color, col) => {
      return (
        <Field
          key={row.toString() + col.toString()}
          row={row}
          col={col}
          style={{
            backgroundColor: color,
            outlineWidth: params.outlineBoard[row][col].split(" ")[0],
            outlineColor: params.outlineBoard[row][col].split(" ")[2],
            outlineStyle: params.outlineBoard[row][col].split(" ")[1],
          }}
          disabled={row === 0 ? params.gameOver : true}
        />
      );
    })
  );

  const displayMem = params.menu ? "none" : "";

  return (
    <div className="board-outer" style={{ display: displayMem }}>
      <div className="board-inner">
        {fields.map((subarr) => subarr.map((field) => field))}
      </div>
      <Return />
      <br />
      <Restart />
    </div>
  );
}

function Restart() {
  return (
    <button
      className="inner-button"
      id="restart"
      hidden={!params.gameOver}
      onClick={() => clickHandlerRestart(params)}
    >
      &#8634;
    </button>
  );
}

function Return() {
  return (
    <button className="inner-button" onClick={() => clickHandlerReturn(params)}>
      menu
    </button>
  );
}

function Gamemode() {
  return (
    <div className="gamemode-div" hidden={!params.menu}>
      <button
        className="gamemode-button"
        onClick={() => clickHandlerGamemode(params, 1)}
      >
        singleplayer
      </button>
      <br />
      <button
        className="gamemode-button"
        onClick={() => clickHandlerGamemode(params, 2)}
      >
        multiplayer
      </button>
    </div>
  );
}

function Message() {
  const displayMem = params.menu ? "none" : "";
  return (
    <p className="message" style={{ display: displayMem }}>
      {params.message}
    </p>
  );
}

function Heading() {
  const displayMem = !params.menu ? "none" : "";
  return (
    <h1 className="heading" style={{ display: displayMem }}>
      CONNECT4
    </h1>
  );
}
