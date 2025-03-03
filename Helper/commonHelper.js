import { globalState } from "../index.js";
import { keySquareMapper } from "../index.js";

//функция шаха если фигура рядом с противником
function checkPieceOfOpponentOnElement(id, color) {
    const opponentColor = color === "white" ? "black" : "white";

    const element = keySquareMapper[id];

    if (!element) return false;

    if (element.piece && element.piece.piece_name.includes(opponentColor)) {
        const el = document.getElementById(id);
        el.classList.add("captureColor");
        element.captureHighlight = true;
        return true;
    }

    return false;
}

//функция для проверки фигуры перед шахом (чтобы шах не сработал когда впереди фигура)

function checkWeatherPieceExistsOrNot(squareId) {
    const square = keySquareMapper[squareId];

    if (square.piece) {
        return square;
    } else {
        return false;
    }
}

//функция для проверки Capture ids в клетке
function checkSquareCaptureId(array) {
    let returnArray = [];

    for (let index = 0; index < array.length; index++) {
        const squareId = array[index];
        const square = keySquareMapper[squareId];

        if (square.piece) {
            break;
        }
        returnArray.push(squareId);
    }

    return returnArray;
}

//функция для подсветки ходов слона
function giveBishopHighlightIds(id) {
    let finalReturnArray = [];

    //выдает айди фигуры сверху слева
    function topLeft(id) {
        let alpha = id[0];
        let num = Number(id[1]);
        let resultArray = [];

        while (alpha != "a" && num != 8) {
            alpha = String.fromCharCode(alpha.charCodeAt(0) - 1);
            num = num + 1;
            resultArray.push(`${alpha}${num}`);
        }

        return resultArray;
    }

    //выдает айди фигуры снизу слева
    function bottomLeft(id) {
        let alpha = id[0];
        let num = Number(id[1]);
        let resultArray = [];

        while (alpha != "a" && num != 1) {
            alpha = String.fromCharCode(alpha.charCodeAt(0) - 1);
            num = num - 1;
            resultArray.push(`${alpha}${num}`);
        }

        return resultArray;
    }

    //находит айди сверху справа
    function topRight(id) {
        let alpha = id[0];
        let num = Number(id[1]);
        let resultArray = [];

        while (alpha != "h" && num != 8) {
            alpha = String.fromCharCode(alpha.charCodeAt(0) + 1);
            num = num + 1;
            resultArray.push(`${alpha}${num}`);
        }

        return resultArray;
    }

    //находит айди снизу справа
    function bottomRight(id) {
        let alpha = id[0];
        let num = Number(id[1]);
        let resultArray = [];

        while (alpha != "h" && num != 1) {
            alpha = String.fromCharCode(alpha.charCodeAt(0) + 1);
            num = num - 1;
            resultArray.push(`${alpha}${num}`);
        }

        return resultArray;
    }

    return {
        topLeft: topLeft(id),
        bottomLeft: bottomLeft(id),
        topRight: topRight(id),
        bottomRight: bottomRight(id),
    };
}

function giveRookHighlightIds(id) {
    let finalReturnArray = [];

    //выдает айди фигуры сверху слева
    function top(id) {
        let alpha = id[0];
        let num = Number(id[1]);
        let resultArray = [];

        while (num != 8) {
            // alpha = String.fromCharCode(alpha.charCodeAt(0) - 1);
            num = num + 1;
            resultArray.push(`${alpha}${num}`);
        }

        return resultArray;
    }

    //выдает айди фигуры снизу слева
    function bottom(id) {
        let alpha = id[0];
        let num = Number(id[1]);
        let resultArray = [];

        while (num != 1) {
            // alpha = String.fromCharCode(alpha.charCodeAt(0) - 1);
            num = num - 1;
            resultArray.push(`${alpha}${num}`);
        }

        return resultArray;
    }

    //находит айди сверху справа
    function right(id) {
        let alpha = id[0];
        let num = Number(id[1]);
        let resultArray = [];

        while (alpha != "h") {
            alpha = String.fromCharCode(alpha.charCodeAt(0) + 1);
            // num = num - 0;
            resultArray.push(`${alpha}${num}`);
        }

        return resultArray;
    }

    //находит айди снизу справа
    function left(id) {
        let alpha = id[0];
        let num = Number(id[1]);
        let resultArray = [];

        while (alpha != "a") {
            alpha = String.fromCharCode(alpha.charCodeAt(0) - 1);
            // num = num - 0;
            resultArray.push(`${alpha}${num}`);
        }

        return resultArray;
    }

    return {
        top: top(id),
        bottom: bottom(id),
        right: right(id),
        left: left(id),
    };
}

export {
    checkPieceOfOpponentOnElement,
    checkSquareCaptureId,
    giveBishopHighlightIds,
    checkWeatherPieceExistsOrNot,
    giveRookHighlightIds,
};
