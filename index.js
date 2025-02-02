import { initGame } from "./Data/data.js";
import { initGameRender } from "./Render/main.js";

// будет полезна для конца игры
const globalState = initGame();

initGameRender(globalState);

