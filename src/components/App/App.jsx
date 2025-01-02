import { useState } from "react";
import { clickHandlerGamemode } from "./AppFunctions.js";
import "./App.css";
import Board from "../Board/Board.jsx";

export const self = {};

const App = () => {
  const [menu, setMenu] = useState(true);
  self.menu = menu;
  self.setMenu = setMenu;
  const [gamemode, setGamemode] = useState(0);
  self.gamemode = gamemode;
  self.setGamemode = setGamemode;

  return (
    <div id="app-container">
      <Heading />
      <Gamemode />
      <Board />
      <Message />
    </div>
  );
};

const Gamemode = () => (
  <div className="gamemode" hidden={!self.menu}>
    <button
      className="gamemode-selection"
      onClick={async () => await clickHandlerGamemode(self, 1)}
    >
      singleplayer
    </button>
    <br />
    <button
      className="gamemode-selection"
      onClick={async () => await clickHandlerGamemode(self, 2)}
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
