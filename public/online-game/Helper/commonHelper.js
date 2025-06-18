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

//функция шаха если фигура рядом с противником
function checkPieceOfOpponentOnElementNoDom(id, color) {
    const opponentColor = color === "white" ? "black" : "white";

    const element = keySquareMapper[id];

    if (!element) return false;

    if (element.piece && element.piece.piece_name.includes(opponentColor)) {
        return true;
    }

    return false;
}

//функция для проверки фигуры перед шахом (чтобы шах не сработал когда впереди фигура)
function checkWeatherPieceExistsOrNot(squareId, currentTurn = null) {
    const square = keySquareMapper[squareId];

    if (square?.piece) {
        if (!currentTurn) return square;

        const isEnemy = square.piece.color !== currentTurn;
        return isEnemy ? square : false;
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
//функция для подсветки шахов слона
function giveBishopCaptureIds(id, color, state = globalState) {
    if (!id) return [];

    const hightlightSquareIds = giveBishopHighlightIds(id);
    const directions = [
        hightlightSquareIds.bottomLeft,
        hightlightSquareIds.topLeft,
        hightlightSquareIds.bottomRight,
        hightlightSquareIds.topRight,
    ];

    const result = [];

    for (const direction of directions) {
        for (const squareId of direction) {
            const square = state.flat().find(s => s.id === squareId);
            if (!square) continue;

            if (square.piece) {
                if (square.piece.color !== color) {
                    result.push(squareId); // можно съесть
                }
                break; // путь перекрыт
            } else {
                // просто пустая клетка — не добавляем
                continue;
            }
        }
    }

    return result;
}

//функция для подсветки шахов слона
function giveRookCaptureIds(id, color, state = globalState) {
    if (!id) return [];

    const hightlightSquareIds = giveRookHighlightIds(id);
    const directions = [
        hightlightSquareIds.bottom,
        hightlightSquareIds.top,
        hightlightSquareIds.right,
        hightlightSquareIds.left,
    ];

    const result = [];

    for (const direction of directions) {
        for (const squareId of direction) {
            const square = state.flat().find(s => s.id === squareId);
            if (!square) continue;

            if (square.piece) {
                if (square.piece.color !== color) {
                    result.push(squareId);
                }
                break;
            } else {
                continue;
            }
        }
    }

    return result;
}

//функция для подсветки шахов слона
function giveQueenCaptureIds(id, color, state = globalState) {
    const bishop = giveBishopCaptureIds(id, color, state);
    const rook = giveRookCaptureIds(id, color, state);
    return [...bishop, ...rook];
}

//функция для подсветки ходов ладьи
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

//функция для подсветки ходов коня
function giveKnightHighlightIds(id) {
    if (!id) {
        return;
    }

    function left() {
        let alpha = id[0];
        let num = Number(id[1]);
        let resultArray = [];

        let temp = 0;

        while (alpha != "a") {
            if (temp == 2) {
                break;
            }
            alpha = String.fromCharCode(alpha.charCodeAt(0) - 1);
            // num = num - 0;
            resultArray.push(`${alpha}${num}`);
            temp += 1;
        }

        if (resultArray.length == 2) {
            let finalReturnArray = [];

            const lastElement = resultArray[resultArray.length - 1];
            let alpha = lastElement[0];
            let number = Number(lastElement[1]);
            if (number < 8) {
                finalReturnArray.push(`${alpha}${number + 1}`);
            }
            if (number > 1) {
                finalReturnArray.push(`${alpha}${number - 1}`);
            }
            // resultArray.push(`${Number(lastElement[1])}`);
            return finalReturnArray;
        } else {
            return [];
        }
    }

    function top() {
        let alpha = id[0];
        let num = Number(id[1]);
        let resultArray = [];

        let temp = 0;

        while (num != "8") {
            if (temp == 2) {
                break;
            }

            num = num + 1;
            // alpha = String.fromCharCode(alpha.charCodeAt(0) - 1);
            // num = num - 0;
            resultArray.push(`${alpha}${num}`);
            temp += 1;
        }

        if (resultArray.length == 2) {
            let finalReturnArray = [];

            const lastElement = resultArray[resultArray.length - 1];
            let alpha = lastElement[0];
            let number = Number(lastElement[1]);
            if (alpha != "a") {
                let alpha2 = String.fromCharCode(alpha.charCodeAt(0) - 1);
                finalReturnArray.push(`${alpha2}${number}`);
            }
            if (alpha != "h") {
                let alpha2 = String.fromCharCode(alpha.charCodeAt(0) + 1);
                finalReturnArray.push(`${alpha2}${number}`);
            }
            // resultArray.push(`${Number(lastElement[1])}`);
            return finalReturnArray;
        } else {
            return [];
        }
    }

    function bottom() {
        let alpha = id[0];
        let num = Number(id[1]);
        let resultArray = [];

        let temp = 0;

        while (num != "1") {
            if (temp == 2) {
                break;
            }

            num = num - 1;
            // alpha = String.fromCharCode(alpha.charCodeAt(0) - 1);
            // num = num - 0;
            resultArray.push(`${alpha}${num}`);
            temp += 1;
        }

        if (resultArray.length == 2) {
            let finalReturnArray = [];

            const lastElement = resultArray[resultArray.length - 1];
            let alpha = lastElement[0];
            let number = Number(lastElement[1]);
            if (alpha != "a") {
                let alpha2 = String.fromCharCode(alpha.charCodeAt(0) - 1);
                finalReturnArray.push(`${alpha2}${number}`);
            }
            if (alpha != "h") {
                let alpha2 = String.fromCharCode(alpha.charCodeAt(0) + 1);
                finalReturnArray.push(`${alpha2}${number}`);
            }
            // resultArray.push(`${Number(lastElement[1])}`);
            return finalReturnArray;
        } else {
            return [];
        }
    }

    function right() {
        let alpha = id[0];
        let num = Number(id[1]);
        let resultArray = [];

        let temp = 0;

        while (alpha != "h") {
            if (temp == 2) {
                break;
            }
            alpha = String.fromCharCode(alpha.charCodeAt(0) + 1);
            // num = num - 0;
            resultArray.push(`${alpha}${num}`);
            temp += 1;
        }

        if (resultArray.length == 2) {
            let finalReturnArray = [];

            const lastElement = resultArray[resultArray.length - 1];
            let alpha = lastElement[0];
            let number = Number(lastElement[1]);
            if (number < 8) {
                finalReturnArray.push(`${alpha}${number + 1}`);
            }
            if (number > 1) {
                finalReturnArray.push(`${alpha}${number - 1}`);
            }
            // resultArray.push(`${Number(lastElement[1])}`);
            return finalReturnArray;
        } else {
            return [];
        }
    }

    return [...top(), ...bottom(), ...left(), ...right()];
}

//функция для подсветки ходов ферзя
function giveQueenHighlightIds(id) {
    const rookMoves = giveRookHighlightIds(id);
    const bishopMoves = giveBishopHighlightIds(id);

    return {
        left: rookMoves.left,
        right: rookMoves.right,
        top: rookMoves.top,
        bottom: rookMoves.bottom,

        topLeft: bishopMoves.topLeft,
        bottomLeft: bishopMoves.bottomLeft,
        topRight: bishopMoves.topRight,
        bottomRight: bishopMoves.bottomRight,
    };
}

//функция для подсветки ходов короля
function giveKingHighlightIds(id) {
    const rookMoves = giveRookHighlightIds(id);
    const bishopMoves = giveBishopHighlightIds(id);

    const returnResult = {
        left: rookMoves.left,
        right: rookMoves.right,
        top: rookMoves.top,
        bottom: rookMoves.bottom,

        topLeft: bishopMoves.topLeft,
        bottomLeft: bishopMoves.bottomLeft,
        topRight: bishopMoves.topRight,
        bottomRight: bishopMoves.bottomRight,
    };

    for (const key in returnResult) {
        if (Object.hasOwnProperty.call(returnResult, key)) {
            const element = returnResult[key];

            if (element.length != 0) {
                returnResult[key] = new Array(element[0]);
            }
        }
    }

    return returnResult;
}

//функция для подсветки шахов короля
function giveKingCaptureIds(id, color, state = globalState) {
    if (!id) return [];

    let squares = giveKingHighlightIds(id);
    let result = Object.values(squares).flat();

    return result.filter(squareId => {
        const square = state.flat().find(s => s.id === squareId);
        return square?.piece && square.piece.color !== color;
    });
}

//функция для подсветки ходов коня
function giveKnightCaptureIds(id, color, state = globalState) {
    if (!id) return [];

    const highlightIds = giveKnightHighlightIds(id);

    return highlightIds.filter(squareId => {
        const square = state.flat().find(s => s.id === squareId);
        return square?.piece && square.piece.color !== color;
    });
}

//функция для шаха с пешками
function givePawnCaptureIds(id, color, state = globalState) {
    if (!id) return [];

    const file = id[0];
    const rank = parseInt(id[1]);

    const direction = color === "white" ? 1 : -1;
    const nextRank = rank + direction;
    if (nextRank < 1 || nextRank > 8) return [];

    const captures = [];

    const leftFile = String.fromCharCode(file.charCodeAt(0) - 1);
    const rightFile = String.fromCharCode(file.charCodeAt(0) + 1);

    const possibleCaptures = [
        `${leftFile}${nextRank}`,
        `${rightFile}${nextRank}`,
    ];

    for (const squareId of possibleCaptures) {
        const square = state.flat().find(s => s.id === squareId);
        if (square?.piece && square.piece.color !== color) {
            captures.push(squareId);
        }
    }

    return captures;
}

//реализация шаха
function getAttackedSquares(color, state = globalState) {
    const attacked = [];

    const allPieces = state
        .flat()
        .filter(square => square.piece && square.piece.color === color); // ✅ не opponentColor!

    allPieces.forEach(square => {
        const { piece } = square;
        let captureIds = [];

        switch (piece.piece_name.toLowerCase()) {
            case "bishop":
                captureIds = giveBishopCaptureIds(square.id, color, state);
                break;
            case "rook":
                captureIds = giveRookCaptureIds(square.id, color, state);
                break;
            case "queen":
                captureIds = giveQueenCaptureIds(square.id, color, state);
                break;
            case "king":
                captureIds = giveKingCaptureIds(square.id, color, state);
                break;
            case "knight":
                captureIds = giveKnightCaptureIds(square.id, color, state);
                break;
            case "pawn":
                captureIds = givePawnCaptureIds(square.id, color, state);
                break;
        }

        attacked.push(...captureIds);
    });

    return [...new Set(attacked)];
}

export {
    checkPieceOfOpponentOnElement,
    checkSquareCaptureId,
    giveBishopHighlightIds,
    checkWeatherPieceExistsOrNot,
    giveRookHighlightIds,
    giveKnightHighlightIds,
    giveQueenHighlightIds,
    giveKingHighlightIds,
    giveKingCaptureIds,
    giveKnightCaptureIds,
    giveRookCaptureIds,
    giveBishopCaptureIds,
    giveQueenCaptureIds,
    getAttackedSquares,
    givePawnCaptureIds,
};
