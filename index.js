import { initGame } from "./Data/data.js";
import { GlobalEvent } from "./Events/global.js";
import { initGameRender } from "./Render/main.js";

// будет полезна для конца игры
const globalState = initGame(); //получение данных
let keySquareMapper = {};

globalState.flat().forEach(square => {
    keySquareMapper[square.id] = square;
});

initGameRender(globalState);
GlobalEvent();

String.prototype.replaceAt = function (index, replacement) {
    return (
        this.substring(0, index) +
        replacement +
        this.substring(index + replacement.length)
    );
};

export { globalState, keySquareMapper };
