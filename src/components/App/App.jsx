import { useState } from "react";
import { clickHandlerGameMode } from "./AppFunctions.js";
import "./App.css";
import Board from "../Board/Board.jsx";

export const self = {};

const App = () => {
  const [menu, setMenu] = useState(true);
  self.menu = menu;
  self.setMenu = setMenu;
  const [gameMode, setGameMode] = useState(0);
  self.gameMode = gameMode;
  self.setGameMode = setGameMode;

  return (
    <div id="app-container">
      <Heading />
      <GameMode />
      <Board />
      <Message />
    </div>
  );
};

const GameMode = () => (
  <div className="gamemode" hidden={!self.menu}>
    <button
      className="gamemode-selection"
      onClick={async () => await clickHandlerGameMode(self, 1)}
    >
      singleplayer
    </button>
    <br />
    <button
      className="gamemode-selection"
      onClick={async () => await clickHandlerGameMode(self, 2)}
    >
      multiplayer
    </button>
  </div>
);

const Heading = () => (
  <h1 className="heading" hidden={!self.menu}>
    CONNECT4
  </h1>
);

const Message = () => {
  const [message, setMessage] = useState("");
  self.message = message;
  self.setMessage = setMessage;

  return (
    <p className="message" hidden={self.menu}>
      {message}
    </p>
  );
};

export default App;
