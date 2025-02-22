import { globalState } from "../index.js";

//функция шаха если фигура рядом с противником
function checkPieceOfOpponentOnElement(id, color) {
    const flatArray = globalState.flat();
    const opponentColor = color === "white" ? "black" : "white";

    for (let index = 0; index < flatArray.length; index++) {
        const element = flatArray[index];
        if (element.id == id) {
            if (
                element.piece &&
                element.piece.piece_name.includes(opponentColor)
            ) {
                const el = document.getElementById(id);
                el.classList.add("captureColor");
                element.captureHighlight = true;
            }
            break;
        }
    }

    return false;
}

export { checkPieceOfOpponentOnElement };
