import { useState } from "react";
import {
  clickHandlerTurn,
  clickHandlerRestart,
  clickHandlerGamemode,
  clickHandlerReturn,
  clickHandlerLoadBoard,
  clickHandlerCopyClipboard,
} from "./functions";

const self = {};

export default function App() {
  const [colorBoard, setColorBoard] = useState(
    Array.from(Array(6), () => new Array(7).fill("white"))
  );
  self.colorBoard = colorBoard;
  self.setColorBoard = setColorBoard;

  const [outlineBoard, setOutlineBoard] = useState(
    Array.from(Array(6), () => new Array(7).fill("0px solid black"))
  );
  self.outlineBoard = outlineBoard;
  self.setOutlineBoard = setOutlineBoard;

  const [gameOver, setGameOver] = useState(false);
  self.gameOver = gameOver;
  self.setGameOver = setGameOver;

  const [currentPlayer, setCurrentPlayer] = useState("red");
  self.currentPlayer = currentPlayer;
  self.setCurrentPlayer = setCurrentPlayer;

  const [message, setMessage] = useState("");
  self.message = message;
  self.setMessage = setMessage;

  const [turns, setTurns] = useState(0);
  self.turns = turns;
  self.setTurns = setTurns;

  const [menu, setMenu] = useState(true);
  self.menu = menu;
  self.setMenu = setMenu;

  const [gamemode, setGamemode] = useState(0);
  self.gamemode = gamemode;
  self.setGamemode = setGamemode;

  const [turnsMem, setTurnsMem] = useState("");
  self.turnsMem = turnsMem;
  self.setTurnsMem = setTurnsMem;

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
      : self.currentPlayer === "red" && row === 0
      ? hoverColor
      : self.currentPlayer === "yellow" && row === 0 && hoverColor,
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
        await clickHandlerTurn(self, col);
        if (self.gamemode === 2) {
          self.currentPlayer === "red"
            ? setHoverColor("hsla(0, 100%, 80%, 1)")
            : setHoverColor("hsla(60, 100%, 80%, 1)");
        }
      }}
      disabled={disabled}
      onMouseEnter={() => {
        if (!disabled) {
          setPointer(!self.gameOver);
        }
        self.currentPlayer === "red"
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
  const fields = self.colorBoard.map((subarr, row) =>
    subarr.map((color, col) => {
      return (
        <Field
          key={row.toString() + col.toString()}
          row={row}
          col={col}
          style={{
            backgroundColor: color,
            outlineWidth: self.outlineBoard[row][col].split(" ")[0],
            outlineColor: self.outlineBoard[row][col].split(" ")[2],
            outlineStyle: self.outlineBoard[row][col].split(" ")[1],
          }}
          disabled={row === 0 ? self.gameOver : true}
        />
      );
    })
  );

  const displayMem = self.menu ? "none" : "";
  const displayState = self.gamemode === 1 ? "none" : "";

  return (
    <div className="board-outer" style={{ display: displayMem }}>
      <div className="board-inner">
        {fields.map((subarr) => subarr.map((field) => field))}
      </div>
      <BoardState display={displayState} />
      <br />
      <div className="action-bar">
        <Return />
        <Restart />
      </div>
    </div>
  );
}

function Restart() {
  return (
    <button
      className="inner-button"
      id="restart"
      hidden={!self.gameOver}
      onClick={() => clickHandlerRestart(self)}
    >
      &#8634;
    </button>
  );
}

function Return() {
  return (
    <button className="inner-button" onClick={() => clickHandlerReturn(self)}>
      menu
    </button>
  );
}

function Gamemode() {
  return (
    <div className="gamemode-div" hidden={!self.menu}>
      <button
        className="gamemode-button"
        onClick={() => clickHandlerGamemode(self, 1)}
      >
        singleplayer
      </button>
      <br />
      <button
        className="gamemode-button"
        onClick={() => clickHandlerGamemode(self, 2)}
      >
        multiplayer
      </button>
    </div>
  );
}

function Message() {
  const displayMem = self.menu ? "none" : "";
  return (
    <p className="message" style={{ display: displayMem }}>
      {self.message}
    </p>
  );
}

function Heading() {
  const displayMem = !self.menu ? "none" : "";
  return (
    <h1 className="heading" style={{ display: displayMem }}>
      CONNECT4
    </h1>
  );
}

function BoardState({ display }) {
  const [boardDecimal, setBoardDecimal] = useState("");
  self.boardDecimal = boardDecimal;
  self.setBoardDecimal = setBoardDecimal;

  const [inputDecimal, setInputDecimal] = useState("");
  self.inputDecimal = inputDecimal;
  self.setInputDecimal = setInputDecimal;

  const [showCopy, setShowCopy] = useState(false);
  self.showCopy = showCopy;
  self.setShowCopy = setShowCopy;

  return (
    <div style={{ display: display }}>
      <div className="board-state">
        <div className="field-div">
          <button
            className="inner-button"
            onClick={() => {
              clickHandlerCopyClipboard(self);
            }}
          >
            state
          </button>
        </div>
        <input
          className="board-rw"
          id="1"
          type="text"
          readOnly={true}
          value={self.showCopy ? "copied to clipboard!" : self.boardDecimal}
        />
      </div>
      <div className="board-state">
        <div className="field-div">
          <button
            className="inner-button"
            onClick={() => clickHandlerLoadBoard(self, self.inputDecimal)}
          >
            load
          </button>
        </div>
        <input
          className="board-rw"
          type="text"
          value={self.inputDecimal}
          onChange={(i) => setInputDecimal(i.target.value)}
        />
      </div>
    </div>
  );
}
