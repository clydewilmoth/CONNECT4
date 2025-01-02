import { clickHandlerBotTurn } from "../Board/BoardFunctions";

export const clickHandlerGameMode = async (self, gameMode) => {
  await self.setMenu(false);
  await self.setMessage("red's turn");
  await self.setGameMode(gameMode);
  if (gameMode === 1) {
    await clickHandlerBotTurn(self, 0, true);
  }
};
