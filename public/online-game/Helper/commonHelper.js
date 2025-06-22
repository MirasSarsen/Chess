import { globalState } from "../index.js";
import { keySquareMapper } from "../index.js";

//функция шаха если фигура рядом с противником
function checkPieceOfOpponentOnElement(id, color) {
    const opponentColor = color === "white" ? "black" : "white";
    const element = keySquareMapper[id];

    if (!element || !element.piece) return false;

    if (element.piece.color === opponentColor) {
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
    const directions = [
        [1, 1],
        [-1, 1],
        [1, -1],
        [-1, -1],
    ];
    const result = [];

    const flatState = Object.values(state).flat();

    for (const [df, dr] of directions) {
        let file = id[0];
        let rank = parseInt(id[1]);

        while (true) {
            file = String.fromCharCode(file.charCodeAt(0) + df);
            rank += dr;

            if (file < "a" || file > "h" || rank < 1 || rank > 8) break;

            const squareId = `${file}${rank}`;
            const square = flatState.find(s => s.id === squareId);
            if (!square) break;

            if (square.piece) {
                //  Добавляем любую первую фигуру (даже короля)
                result.push(squareId);
                break;
            }
        }
    }

    return result;
}

//функция для подсветки шахов
function giveRookCaptureIds(id, color, state = globalState) {
    const directions = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
    ];

    const result = [];
    const flatState = Object.values(state).flat();

    for (const [df, dr] of directions) {
        let file = id[0];
        let rank = parseInt(id[1]);

        while (true) {
            file = String.fromCharCode(file.charCodeAt(0) + df);
            rank += dr;

            if (file < "a" || file > "h" || rank < 1 || rank > 8) break;

            const squareId = `${file}${rank}`;
            const square = flatState.find(s => s.id === squareId);

            if (!square) break;

            if (square.piece) {
                result.push(squareId); // добавляем всегда
                break;
            }
        }
    }

    return result;
}

//функция для подсветки шахов ферзч
function giveQueenCaptureIds(id, color, state = globalState) {
    const bishop = giveBishopCaptureIds(id, color, state);
    const rook = giveRookCaptureIds(id, color, state);
    return [...bishop, ...rook];
}

//функция для подсветки ходов ладьи
function giveRookHighlightIds(id) {
    let file = id[0];
    let rank = Number(id[1]);

    const directions = {
        top: [],
        bottom: [],
        right: [],
        left: [],
    };

    // Вверх
    for (let r = rank + 1; r <= 8; r++) {
        directions.top.push(`${file}${r}`);
    }

    // Вниз
    for (let r = rank - 1; r >= 1; r--) {
        directions.bottom.push(`${file}${r}`);
    }

    // Вправо
    for (let f = file.charCodeAt(0) + 1; f <= "h".charCodeAt(0); f++) {
        directions.right.push(`${String.fromCharCode(f)}${rank}`);
    }

    // Влево
    for (let f = file.charCodeAt(0) - 1; f >= "a".charCodeAt(0); f--) {
        directions.left.push(`${String.fromCharCode(f)}${rank}`);
    }

    return directions;
}

//функция для подсветки ходов коня
function giveKnightHighlightIds(id) {
    if (!id) return [];

    const file = id[0];
    const rank = parseInt(id[1]);

    const moves = [
        [2, 1],
        [1, 2],
        [-1, 2],
        [-2, 1],
        [-2, -1],
        [-1, -2],
        [1, -2],
        [2, -1],
    ];

    const result = [];

    for (const [df, dr] of moves) {
        const newFile = String.fromCharCode(file.charCodeAt(0) + df);
        const newRank = rank + dr;

        if (newFile >= "a" && newFile <= "h" && newRank >= 1 && newRank <= 8) {
            result.push(`${newFile}${newRank}`);
        }
    }

    return result;
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
function giveKingHighlightIds(id, color) {
    const file = id[0];
    const rank = parseInt(id[1]);

    const directions = {
        topLeft: [-1, 1],
        top: [0, 1],
        topRight: [1, 1],
        left: [-1, 0],
        right: [1, 0],
        bottomLeft: [-1, -1],
        bottom: [0, -1],
        bottomRight: [1, -1],
    };

    const result = {};

    for (const dir in directions) {
        const [df, dr] = directions[dir];
        const f = String.fromCharCode(file.charCodeAt(0) + df);
        const r = rank + dr;
        const squareId = f + r;

        const square = keySquareMapper[squareId];
        if (square && (!square.piece || square.piece.color !== color)) {
            result[dir] = [squareId]; // массив из 1 клетки
        } else {
            result[dir] = []; // пустой массив, если нельзя туда пойти
        }
    }

    result.all = Object.values(result).flat();
    return result;
}

function generateLineMoves(startId, df, dr) {
    const moves = [];
    let file = startId[0];
    let rank = parseInt(startId[1]);

    while (true) {
        file = String.fromCharCode(file.charCodeAt(0) + df);
        rank += dr;

        if (file < "a" || file > "h" || rank < 1 || rank > 8) break;
        moves.push(`${file}${rank}`);
    }

    return moves;
}

//функция для подсветки шахов короля
function giveKingCaptureIds(id, color, state = globalState) {
    if (!id) return [];

    let squares = giveKingHighlightIds(id);
    let result = Object.values(squares).flat();

    return result.filter(squareId => {
        const square = Object.values(state).find(s => s.id === squareId);
        return square?.piece && square.piece.color !== color;
    });
}

//функция для подсветки ходов коня
function giveKnightCaptureIds(id, color, state = globalState) {
    if (!id) return [];

    const highlightIds = giveKnightHighlightIds(id);

    return highlightIds.filter(squareId => {
        const square = Object.values(state).find(s => s.id === squareId);
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

    const possibleCaptures = [];

    if (leftFile >= "a") possibleCaptures.push(`${leftFile}${nextRank}`);
    if (rightFile <= "h") possibleCaptures.push(`${rightFile}${nextRank}`);

    for (const squareId of possibleCaptures) {
        const square = Object.values(state).find(s => s.id === squareId);
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
