import { useState } from "react";
import {
  clickHandlerRestart,
  clickHandlerReturn,
  clickHandlerLoadBoard,
  clickHandlerCopyClipboard,
  clickHandlerBotTurn,
  clickHandlerPlayerTurn,
} from "./BoardFunctions.js";
import "./Board.css";
import { self } from "../App/App.jsx";

const Board = () => {
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

  const fields = colorBoard.map((subarr, row) =>
    subarr.map((color, col) => {
      return (
        <Field
          key={row.toString() + col.toString()}
          row={row}
          col={col}
          style={{
            backgroundColor: color,
            outlineWidth: outlineBoard[row][col].split(" ")[0],
            outlineColor: outlineBoard[row][col].split(" ")[2],
            outlineStyle: outlineBoard[row][col].split(" ")[1],
          }}
          disabled={row === 0 ? gameOver : true}
        />
      );
    })
  );

  const display = self.menu ? "none" : "grid";

  return (
    <div className="board-outer" style={{ display: display }}>
      <div className="board-inner">
        {fields.map((subarr) => subarr.map((field) => field))}
      </div>
      <TurnDisplay />
      <BoardState />
      <div className="board-action">
        <Return />
        <Restart />
      </div>
    </div>
  );
};

const Field = ({ row, col, style, disabled }) => {
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
        if (self.gameMode === 1) {
          if ((await clickHandlerPlayerTurn(self, col)) && !self.gameOver) {
            await clickHandlerBotTurn(self, col, true);
          }
        } else {
          await clickHandlerPlayerTurn(self, col);
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
};

const BoardState = () => {
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
    <div className="board-state" hidden={self.menu}>
      <div className="board-state-line">
        <div className="board-state-action">
          <button
            className="action-button"
            onClick={() => {
              clickHandlerCopyClipboard(self);
            }}
          >
            state
          </button>
        </div>
        <input
          className="board-state-number"
          type="text"
          readOnly={true}
          value={showCopy ? "copied to clipboard!" : boardDecimal}
          name="board-state-output"
        />
      </div>
      <div className="board-state-line">
        <div className="board-state-action">
          <button
            className="action-button"
            onClick={() => clickHandlerLoadBoard(self, inputDecimal)}
          >
            load
          </button>
        </div>
        <input
          className="board-state-number"
          type="text"
          value={inputDecimal}
          name="board-state-input"
          onChange={(i) => setInputDecimal(i.target.value)}
        />
      </div>
    </div>
  );
};

function TurnDisplay() {
  const [turns, setTurns] = useState(0);
  self.turns = turns;
  self.setTurns = setTurns;

  const [turnsMem, setTurnsMem] = useState("");
  self.turnsMem = turnsMem;
  self.setTurnsMem = setTurnsMem;

  const [turnsDisplay, setTurnsDisplay] = useState([]);
  self.turnsDisplay = turnsDisplay;
  self.setTurnsDisplay = setTurnsDisplay;

  return (
    <div className="turns-display">
      <table>
        <thead>
          <tr>
            <th>turn</th>
            <th>column</th>
          </tr>
        </thead>
        <tbody>
          {turnsDisplay.map((element, index) => {
            return (
              <tr key={element}>
                <td
                  className="action-button"
                  onClick={() =>
                    clickHandlerLoadBoard(self, element.split(" ")[0])
                  }
                >
                  {index + 1}
                  <br />
                  {self.gameMode === 2
                    ? index % 2 === 0
                      ? "(red)"
                      : "(yellow)"
                    : index % 2 === 0
                    ? "(bot)"
                    : "(player)"}
                </td>
                <td
                  className="action-button"
                  onClick={() =>
                    clickHandlerLoadBoard(self, element.split(" ")[0])
                  }
                >
                  {element.split(" ")[1]}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const Return = () => (
  <button className="action-button" onClick={() => clickHandlerReturn(self)}>
    menu
  </button>
);

const Restart = () => (
  <button
    className="action-button"
    id="restart"
    hidden={!self.gameOver || !self.turns > 0}
    onClick={() => clickHandlerRestart(self, true)}
  >
    &#8634;
  </button>
);

export default Board;
