export const clickHandlerGamemode = async (self, gamemode) => {
  await self.setMenu(false);
  await self.setGamemode(gamemode);
};
