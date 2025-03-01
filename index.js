import { initGame } from "./Data/data.js";
import { GlobalEvent } from "./Events/global.js";
import { initGameRender } from "./Render/main.js";

// будет полезна для конца игры
const globalState = initGame();
let keySquareMapper = {};

globalState.flat().forEach(square => {
    keySquareMapper[square.id] = square;
});

initGameRender(globalState);
GlobalEvent();

export { globalState, keySquareMapper };
