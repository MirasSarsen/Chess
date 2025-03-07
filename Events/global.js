import { ROOT_DIV } from "../Helper/constants.js";
import { globalState, keySquareMapper } from "../index.js";
import {
    globalStateRender,
    clearHightlight,
    selfHighlight,
} from "../Render/main.js";
import {
    checkPieceOfOpponentOnElement,
    checkSquareCaptureId,
    giveBishopHighlightIds,
    checkWeatherPieceExistsOrNot,
    giveRookHighlightIds,
    giveKnightHighlightIds,
    giveQueenHighlightIds,
    giveKingHighlightIds,
} from "../Helper/commonHelper.js";

let inTurn = "white";

function changeTurn() {
    inTurn = inTurn === "white" ? "black" : "white";
}

function captureInTurn(square) {
    const piece = square.piece;

    if (piece == selfHighlightState) {
        clearPreviousSelfHighlight(selfHighlightState);
        clearHighlightLocal();
        return;
    }

    if (square.captureHighlight) {
        // фигура хавает других
        moveElement(selfHighlightState, piece.current_position);
        clearPreviousSelfHighlight(selfHighlightState);
        clearHighlightLocal();
        return;
    }

    return;
}

//динамическое передвижение фигур благодаря айдишникам
function moveElement(piece, id) {
    changeTurn();
    const flatData = globalState.flat();

    flatData.forEach(el => {
        if (el.id == piece.current_position) {
            delete el.piece;
        }
        if (el.id == id) {
            el.piece = piece;
        }
    });
    const previousPiece = document.getElementById(piece.current_position);
    previousPiece.classList.remove("hightlightYellow");
    const currentPiece = document.getElementById(id);
    currentPiece.innerHTML = previousPiece.innerHTML;
    previousPiece.innerHTML = "";
    piece.current_position = id;
    clearHightlight();
}

//подсветить или нет (стейт)
let hightlight_state = false;

//правильное состояние подсветки (то есть, чтобы очищать фон с посл клика)
let selfHighlightState = null;

//состояние для динамического движения
let moveState = null;

//локальная функция очистки подсветки
function clearHighlightLocal() {
    clearHightlight();
    hightlight_state = false;
}

//передвижение фигуры относительно х-доски и у-доски
function movePieceFromXToY(from, to) {
    to.piece = from.piece;
    from.piece = null;
    globalStateRender();
}

//логика белых пешек
function whitePawnClick(square) {
    const piece = square.piece;

    if (piece == selfHighlightState) {
        clearPreviousSelfHighlight(selfHighlightState);
        clearHighlightLocal();
        return;
    }

    if (square.captureHighlight) {
        // пешка хавает других
        moveElement(selfHighlightState, piece.current_position);
        clearPreviousSelfHighlight(selfHighlightState);
        clearHighlightLocal();
        return;
    }

    //очистить всю доску от подсветок
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();

    //подсветка фигуры при клике
    selfHighlight(piece);
    hightlight_state = true;
    selfHighlightState = piece;

    //фигура для динамического движения
    moveState = piece;

    const current_pos = piece.current_position;
    const flatArray = globalState.flat();

    //иницилизация позиции для передвижения
    if (current_pos[1] === "2") {
        //начальная позиция
        let hightlightSquareIds = [
            `${current_pos[0]}${Number(current_pos[1]) + 1}`,
            `${current_pos[0]}${Number(current_pos[1]) + 2}`,
        ];

        hightlightSquareIds = checkSquareCaptureId(hightlightSquareIds);

        hightlightSquareIds.forEach(hightlight => {
            const element = keySquareMapper[hightlight];
            element.highlight = true;
        });

        globalStateRender();
    } else {
        const col1 = `${String.fromCharCode(current_pos[0].charCodeAt(0) - 1)}${
            Number(current_pos[1]) + 1
        }`;
        const col2 = `${String.fromCharCode(current_pos[0].charCodeAt(0) + 1)}${
            Number(current_pos[1]) + 1
        }`;

        let captureIds = [col1, col2];
        // captureIds = checkSquareCaptureId(captureIds);

        //с той же позиции
        const hightlightSquareIds = [
            `${current_pos[0]}${Number(current_pos[1]) + 1}`,
        ];

        captureIds.forEach(element => {
            checkPieceOfOpponentOnElement(element, "white");
        });

        hightlightSquareIds.forEach(hightlight => {
            const element = keySquareMapper[hightlight];
            element.highlight = true;
        });

        globalStateRender();
    }
}

//логика белого слона
function whiteBishopClick(square) {
    const piece = square.piece;

    if (piece == selfHighlightState) {
        clearPreviousSelfHighlight(selfHighlightState);
        clearHighlightLocal();
        return;
    }

    if (square.captureHighlight) {
        // слон хавает других
        moveElement(selfHighlightState, piece.current_position);
        clearPreviousSelfHighlight(selfHighlightState);
        clearHighlightLocal();
        return;
    }

    //очистить всю доску от подсветок
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();

    //подсветка фигуры при клике
    selfHighlight(piece);
    hightlight_state = true;
    selfHighlightState = piece;

    //фигура для динамического движения
    moveState = piece;

    const current_pos = piece.current_position;
    const flatArray = globalState.flat();

    let hightlightSquareIds = giveBishopHighlightIds(current_pos);
    let temp = [];

    const { bottomLeft, topLeft, bottomRight, topRight } = hightlightSquareIds;

    let result = [];
    result.push(checkSquareCaptureId(bottomLeft));
    result.push(checkSquareCaptureId(topLeft));
    result.push(checkSquareCaptureId(bottomRight));
    result.push(checkSquareCaptureId(topRight));

    //для темп
    temp.push(bottomLeft);
    temp.push(topLeft);
    temp.push(bottomRight);
    temp.push(topRight);

    // hightlightSquareIds = checkSquareCaptureId(hightlightSquareIds);
    hightlightSquareIds = result.flat();

    hightlightSquareIds.forEach(hightlight => {
        const element = keySquareMapper[hightlight];
        element.highlight = true;
    });

    hightlightSquareIds.forEach(hightlight => {
        const element = keySquareMapper[hightlight];
        element.highlight = true;
    });

    let captureIds = [];

    for (let index = 0; index < temp.length; index++) {
        const arr = temp[index];

        for (let j = 0; j < arr.length; j++) {
            const element = arr[j];

            let checkPieceResult = checkWeatherPieceExistsOrNot(element);
            if (
                checkPieceResult &&
                checkPieceResult.piece &&
                checkPieceResult.piece.piece_name
                    .toLowerCase()
                    .includes("white")
            ) {
                break;
            }

            if (checkPieceOfOpponentOnElement(element, "white")) {
                break;
            }
        }
    }

    globalStateRender();
}

//логика белой ладьи
function whiteRookClick(square) {
    const piece = square.piece;

    if (piece == selfHighlightState) {
        clearPreviousSelfHighlight(selfHighlightState);
        clearHighlightLocal();
        return;
    }

    if (square.captureHighlight) {
        // ладья хавает других
        moveElement(selfHighlightState, piece.current_position);
        clearPreviousSelfHighlight(selfHighlightState);
        clearHighlightLocal();
        return;
    }

    //очистить всю доску от подсветок
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();

    //подсветка фигуры при клике
    selfHighlight(piece);
    hightlight_state = true;
    selfHighlightState = piece;

    //фигура для динамического движения
    moveState = piece;

    const current_pos = piece.current_position;
    const flatArray = globalState.flat();

    let hightlightSquareIds = giveRookHighlightIds(current_pos);
    let temp = [];

    const { top, bottom, left, right } = hightlightSquareIds;

    let result = [];
    result.push(checkSquareCaptureId(top));
    result.push(checkSquareCaptureId(bottom));
    result.push(checkSquareCaptureId(left));
    result.push(checkSquareCaptureId(right));

    //для темп
    temp.push(top);
    temp.push(bottom);
    temp.push(left);
    temp.push(right);

    // hightlightSquareIds = checkSquareCaptureId(hightlightSquareIds);
    hightlightSquareIds = result.flat();

    hightlightSquareIds.forEach(hightlight => {
        const element = keySquareMapper[hightlight];
        element.highlight = true;
    });

    hightlightSquareIds.forEach(hightlight => {
        const element = keySquareMapper[hightlight];
        element.highlight = true;
    });

    let captureIds = [];

    for (let index = 0; index < temp.length; index++) {
        const arr = temp[index];

        for (let j = 0; j < arr.length; j++) {
            const element = arr[j];

            let checkPieceResult = checkWeatherPieceExistsOrNot(element);
            if (
                checkPieceResult &&
                checkPieceResult.piece &&
                checkPieceResult.piece.piece_name
                    .toLowerCase()
                    .includes("white")
            ) {
                break;
            }

            if (checkPieceOfOpponentOnElement(element, "white")) {
                break;
            }
        }
    }

    globalStateRender();
}

//логика белого коня
function whiteKnightClick(square) {
    const piece = square.piece;

    if (piece == selfHighlightState) {
        clearPreviousSelfHighlight(selfHighlightState);
        clearHighlightLocal();
        return;
    }

    if (square.captureHighlight) {
        // конь хавает других
        moveElement(selfHighlightState, piece.current_position);
        clearPreviousSelfHighlight(selfHighlightState);
        clearHighlightLocal();
        return;
    }

    //очистить всю доску от подсветок
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();

    //подсветка фигуры при клике
    selfHighlight(piece);
    hightlight_state = true;
    selfHighlightState = piece;

    //фигура для динамического движения
    moveState = piece;

    const current_pos = piece.current_position;
    const flatArray = globalState.flat();

    let hightlightSquareIds = giveKnightHighlightIds(current_pos);

    hightlightSquareIds.forEach(hightlight => {
        const element = keySquareMapper[hightlight];
        element.highlight = true;
    });

    let captureIds = [];

    hightlightSquareIds.forEach(element => {
        checkPieceOfOpponentOnElement(element, "white");
    });

    globalStateRender();
}

//логика белого ферзя
function whiteQueenClick(square) {
    const piece = square.piece;

    if (piece == selfHighlightState) {
        clearPreviousSelfHighlight(selfHighlightState);
        clearHighlightLocal();
        return;
    }

    if (square.captureHighlight) {
        // слон хавает других
        moveElement(selfHighlightState, piece.current_position);
        clearPreviousSelfHighlight(selfHighlightState);
        clearHighlightLocal();
        return;
    }

    //очистить всю доску от подсветок
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();

    //подсветка фигуры при клике
    selfHighlight(piece);
    hightlight_state = true;
    selfHighlightState = piece;

    //фигура для динамического движения
    moveState = piece;

    const current_pos = piece.current_position;
    const flatArray = globalState.flat();

    let hightlightSquareIds = giveQueenHighlightIds(current_pos);
    let temp = [];

    const {
        bottomLeft,
        topLeft,
        bottomRight,
        topRight,
        top,
        right,
        left,
        bottom,
    } = hightlightSquareIds;

    let result = [];
    result.push(checkSquareCaptureId(bottomLeft));
    result.push(checkSquareCaptureId(topLeft));
    result.push(checkSquareCaptureId(bottomRight));
    result.push(checkSquareCaptureId(topRight));
    result.push(checkSquareCaptureId(top));
    result.push(checkSquareCaptureId(right));
    result.push(checkSquareCaptureId(left));
    result.push(checkSquareCaptureId(bottom));

    //для темп
    temp.push(bottomLeft);
    temp.push(topLeft);
    temp.push(bottomRight);
    temp.push(topRight);
    temp.push(top);
    temp.push(right);
    temp.push(left);
    temp.push(bottom);

    // hightlightSquareIds = checkSquareCaptureId(hightlightSquareIds);
    hightlightSquareIds = result.flat();

    hightlightSquareIds.forEach(hightlight => {
        const element = keySquareMapper[hightlight];
        element.highlight = true;
    });

    hightlightSquareIds.forEach(hightlight => {
        const element = keySquareMapper[hightlight];
        element.highlight = true;
    });

    let captureIds = [];

    for (let index = 0; index < temp.length; index++) {
        const arr = temp[index];

        for (let j = 0; j < arr.length; j++) {
            const element = arr[j];

            let checkPieceResult = checkWeatherPieceExistsOrNot(element);
            if (
                checkPieceResult &&
                checkPieceResult.piece &&
                checkPieceResult.piece.piece_name
                    .toLowerCase()
                    .includes("white")
            ) {
                break;
            }

            if (checkPieceOfOpponentOnElement(element, "white")) {
                break;
            }
        }
    }

    globalStateRender();
}
//логика белого короля
function whiteKingClick(square) {
    const piece = square.piece;

    if (piece == selfHighlightState) {
        clearPreviousSelfHighlight(selfHighlightState);
        clearHighlightLocal();
        return;
    }

    if (square.captureHighlight) {
        // король хавает других
        moveElement(selfHighlightState, piece.current_position);
        clearPreviousSelfHighlight(selfHighlightState);
        clearHighlightLocal();
        return;
    }

    //очистить всю доску от подсветок
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();

    //подсветка фигуры при клике
    selfHighlight(piece);
    hightlight_state = true;
    selfHighlightState = piece;

    //фигура для динамического движения
    moveState = piece;

    const current_pos = piece.current_position;
    const flatArray = globalState.flat();

    let hightlightSquareIds = giveKingHighlightIds(current_pos);
    let temp = [];

    const {
        bottomLeft,
        topLeft,
        bottomRight,
        topRight,
        top,
        right,
        left,
        bottom,
    } = hightlightSquareIds;

    let result = [];
    result.push(checkSquareCaptureId(bottomLeft));
    result.push(checkSquareCaptureId(topLeft));
    result.push(checkSquareCaptureId(bottomRight));
    result.push(checkSquareCaptureId(topRight));
    result.push(checkSquareCaptureId(top));
    result.push(checkSquareCaptureId(right));
    result.push(checkSquareCaptureId(left));
    result.push(checkSquareCaptureId(bottom));

    //для темп
    temp.push(bottomLeft);
    temp.push(topLeft);
    temp.push(bottomRight);
    temp.push(topRight);
    temp.push(top);
    temp.push(right);
    temp.push(left);
    temp.push(bottom);

    // hightlightSquareIds = checkSquareCaptureId(hightlightSquareIds);
    hightlightSquareIds = result.flat();

    hightlightSquareIds.forEach(hightlight => {
        const element = keySquareMapper[hightlight];
        element.highlight = true;
    });

    hightlightSquareIds.forEach(hightlight => {
        const element = keySquareMapper[hightlight];
        element.highlight = true;
    });

    let captureIds = [];

    for (let index = 0; index < temp.length; index++) {
        const arr = temp[index];

        for (let j = 0; j < arr.length; j++) {
            const element = arr[j];

            let checkPieceResult = checkWeatherPieceExistsOrNot(element);
            if (
                checkPieceResult &&
                checkPieceResult.piece &&
                checkPieceResult.piece.piece_name
                    .toLowerCase()
                    .includes("white")
            ) {
                break;
            }

            if (checkPieceOfOpponentOnElement(element, "white")) {
                break;
            }
        }
    }

    globalStateRender();
}

//логика черного коня
function blackKingClick(square) {
    const piece = square.piece;

    if (piece == selfHighlightState) {
        clearPreviousSelfHighlight(selfHighlightState);
        clearHighlightLocal();
        return;
    }

    if (square.captureHighlight) {
        // король хавает других
        moveElement(selfHighlightState, piece.current_position);
        clearPreviousSelfHighlight(selfHighlightState);
        clearHighlightLocal();
        return;
    }

    //очистить всю доску от подсветок
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();

    //подсветка фигуры при клике
    selfHighlight(piece);
    hightlight_state = true;
    selfHighlightState = piece;

    //фигура для динамического движения
    moveState = piece;

    const current_pos = piece.current_position;
    const flatArray = globalState.flat();

    let hightlightSquareIds = giveKingHighlightIds(current_pos);
    let temp = [];

    const {
        bottomLeft,
        topLeft,
        bottomRight,
        topRight,
        top,
        right,
        left,
        bottom,
    } = hightlightSquareIds;

    let result = [];
    result.push(checkSquareCaptureId(bottomLeft));
    result.push(checkSquareCaptureId(topLeft));
    result.push(checkSquareCaptureId(bottomRight));
    result.push(checkSquareCaptureId(topRight));
    result.push(checkSquareCaptureId(top));
    result.push(checkSquareCaptureId(right));
    result.push(checkSquareCaptureId(left));
    result.push(checkSquareCaptureId(bottom));

    //для темп
    temp.push(bottomLeft);
    temp.push(topLeft);
    temp.push(bottomRight);
    temp.push(topRight);
    temp.push(top);
    temp.push(right);
    temp.push(left);
    temp.push(bottom);

    // hightlightSquareIds = checkSquareCaptureId(hightlightSquareIds);
    hightlightSquareIds = result.flat();

    hightlightSquareIds.forEach(hightlight => {
        const element = keySquareMapper[hightlight];
        element.highlight = true;
    });

    hightlightSquareIds.forEach(hightlight => {
        const element = keySquareMapper[hightlight];
        element.highlight = true;
    });

    let captureIds = [];

    for (let index = 0; index < temp.length; index++) {
        const arr = temp[index];

        for (let j = 0; j < arr.length; j++) {
            const element = arr[j];

            let checkPieceResult = checkWeatherPieceExistsOrNot(element);
            if (
                checkPieceResult &&
                checkPieceResult.piece &&
                checkPieceResult.piece.piece_name
                    .toLowerCase()
                    .includes("black")
            ) {
                break;
            }

            if (checkPieceOfOpponentOnElement(element, "black")) {
                break;
            }
        }
    }

    globalStateRender();
}

//логика черного ферзя
function blackQueenClick(square) {
    const piece = square.piece;

    if (piece == selfHighlightState) {
        clearPreviousSelfHighlight(selfHighlightState);
        clearHighlightLocal();
        return;
    }

    if (square.captureHighlight) {
        // слон хавает других
        moveElement(selfHighlightState, piece.current_position);
        clearPreviousSelfHighlight(selfHighlightState);
        clearHighlightLocal();
        return;
    }

    //очистить всю доску от подсветок
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();

    //подсветка фигуры при клике
    selfHighlight(piece);
    hightlight_state = true;
    selfHighlightState = piece;

    //фигура для динамического движения
    moveState = piece;

    const current_pos = piece.current_position;
    const flatArray = globalState.flat();

    let hightlightSquareIds = giveQueenHighlightIds(current_pos);
    let temp = [];

    const {
        bottomLeft,
        topLeft,
        bottomRight,
        topRight,
        top,
        right,
        left,
        bottom,
    } = hightlightSquareIds;

    let result = [];
    result.push(checkSquareCaptureId(bottomLeft));
    result.push(checkSquareCaptureId(topLeft));
    result.push(checkSquareCaptureId(bottomRight));
    result.push(checkSquareCaptureId(topRight));
    result.push(checkSquareCaptureId(top));
    result.push(checkSquareCaptureId(right));
    result.push(checkSquareCaptureId(left));
    result.push(checkSquareCaptureId(bottom));

    //для темп
    temp.push(bottomLeft);
    temp.push(topLeft);
    temp.push(bottomRight);
    temp.push(topRight);
    temp.push(top);
    temp.push(right);
    temp.push(left);
    temp.push(bottom);

    hightlightSquareIds = result.flat();

    hightlightSquareIds.forEach(hightlight => {
        const element = keySquareMapper[hightlight];
        element.highlight = true;
    });

    hightlightSquareIds.forEach(hightlight => {
        const element = keySquareMapper[hightlight];
        element.highlight = true;
    });

    let captureIds = [];

    for (let index = 0; index < temp.length; index++) {
        const arr = temp[index];

        for (let j = 0; j < arr.length; j++) {
            const element = arr[j];

            let checkPieceResult = checkWeatherPieceExistsOrNot(element);
            if (
                checkPieceResult &&
                checkPieceResult.piece &&
                checkPieceResult.piece.piece_name
                    .toLowerCase()
                    .includes("black")
            ) {
                break;
            }

            if (checkPieceOfOpponentOnElement(element, "black")) {
                break;
            }
        }
    }

    globalStateRender();
}

//логика черного коня
function blackKnightClick(square) {
    const piece = square.piece;

    if (piece == selfHighlightState) {
        clearPreviousSelfHighlight(selfHighlightState);
        clearHighlightLocal();
        return;
    }

    if (square.captureHighlight) {
        // конь хавает других
        moveElement(selfHighlightState, piece.current_position);
        clearPreviousSelfHighlight(selfHighlightState);
        clearHighlightLocal();
        return;
    }

    //очистить всю доску от подсветок
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();

    //подсветка фигуры при клике
    selfHighlight(piece);
    hightlight_state = true;
    selfHighlightState = piece;

    //фигура для динамического движения
    moveState = piece;

    const current_pos = piece.current_position;
    const flatArray = globalState.flat();

    let hightlightSquareIds = giveKnightHighlightIds(current_pos);

    hightlightSquareIds.forEach(hightlight => {
        const element = keySquareMapper[hightlight];
        element.highlight = true;
    });

    let captureIds = [];

    hightlightSquareIds.forEach(element => {
        checkPieceOfOpponentOnElement(element, "black");
    });

    globalStateRender();
}

//логика черной ладьи
function blackRookClick(square) {
    const piece = square.piece;

    if (piece == selfHighlightState) {
        clearPreviousSelfHighlight(selfHighlightState);
        clearHighlightLocal();
        return;
    }

    if (square.captureHighlight) {
        // ладья хавает других
        moveElement(selfHighlightState, piece.current_position);
        clearPreviousSelfHighlight(selfHighlightState);
        clearHighlightLocal();
        return;
    }

    //очистить всю доску от подсветок
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();

    //подсветка фигуры при клике
    selfHighlight(piece);
    hightlight_state = true;
    selfHighlightState = piece;

    //фигура для динамического движения
    moveState = piece;

    const current_pos = piece.current_position;
    const flatArray = globalState.flat();

    let hightlightSquareIds = giveRookHighlightIds(current_pos);
    let temp = [];

    const { top, bottom, left, right } = hightlightSquareIds;

    let result = [];
    result.push(checkSquareCaptureId(top));
    result.push(checkSquareCaptureId(bottom));
    result.push(checkSquareCaptureId(left));
    result.push(checkSquareCaptureId(right));

    //для темп
    temp.push(top);
    temp.push(bottom);
    temp.push(left);
    temp.push(right);

    hightlightSquareIds = result.flat();

    hightlightSquareIds.forEach(hightlight => {
        const element = keySquareMapper[hightlight];
        element.highlight = true;
    });

    hightlightSquareIds.forEach(hightlight => {
        const element = keySquareMapper[hightlight];
        element.highlight = true;
    });

    let captureIds = [];

    for (let index = 0; index < temp.length; index++) {
        const arr = temp[index];

        for (let j = 0; j < arr.length; j++) {
            const element = arr[j];

            let checkPieceResult = checkWeatherPieceExistsOrNot(element);
            if (
                checkPieceResult &&
                checkPieceResult.piece &&
                checkPieceResult.piece.piece_name
                    .toLowerCase()
                    .includes("black")
            ) {
                break;
            }

            if (checkPieceOfOpponentOnElement(element, "black")) {
                break;
            }
        }
    }

    globalStateRender();
}

//логика черного слона
function blackBishopClick(square) {
    const piece = square.piece;

    if (piece == selfHighlightState) {
        clearPreviousSelfHighlight(selfHighlightState);
        clearHighlightLocal();
        return;
    }

    if (square.captureHighlight) {
        // слон хавает других
        moveElement(selfHighlightState, piece.current_position);
        clearPreviousSelfHighlight(selfHighlightState);
        clearHighlightLocal();
        return;
    }

    //очистить всю доску от подсветок
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();

    //подсветка фигуры при клике
    selfHighlight(piece);
    hightlight_state = true;
    selfHighlightState = piece;

    //фигура для динамического движения
    moveState = piece;

    const current_pos = piece.current_position;
    const flatArray = globalState.flat();

    let hightlightSquareIds = giveBishopHighlightIds(current_pos);
    let temp = [];

    const { bottomLeft, topLeft, bottomRight, topRight } = hightlightSquareIds;

    let result = [];
    result.push(checkSquareCaptureId(bottomLeft));
    result.push(checkSquareCaptureId(topLeft));
    result.push(checkSquareCaptureId(bottomRight));
    result.push(checkSquareCaptureId(topRight));

    //для темп
    temp.push(bottomLeft);
    temp.push(topLeft);
    temp.push(bottomRight);
    temp.push(topRight);

    // hightlightSquareIds = checkSquareCaptureId(hightlightSquareIds);
    hightlightSquareIds = result.flat();

    hightlightSquareIds.forEach(hightlight => {
        const element = keySquareMapper[hightlight];
        element.highlight = true;
    });

    hightlightSquareIds.forEach(hightlight => {
        const element = keySquareMapper[hightlight];
        element.highlight = true;
    });

    let captureIds = [];

    for (let index = 0; index < temp.length; index++) {
        const arr = temp[index];

        for (let j = 0; j < arr.length; j++) {
            const element = arr[j];

            let checkPieceResult = checkWeatherPieceExistsOrNot(element);
            if (
                checkPieceResult &&
                checkPieceResult.piece &&
                checkPieceResult.piece.piece_name
                    .toLowerCase()
                    .includes("black")
            ) {
                break;
            }

            if (checkPieceOfOpponentOnElement(element, "black")) {
                break;
            }
        }
    }

    globalStateRender();
}

//логика черных пешек
function blackPawnClick(square) {
    const piece = square.piece;

    if (piece == selfHighlightState) {
        clearPreviousSelfHighlight(selfHighlightState);
        clearHighlightLocal();
        return;
    }

    if (square.captureHighlight) {
        // пешка хавает других
        moveElement(selfHighlightState, piece.current_position);
        clearPreviousSelfHighlight(selfHighlightState);
        clearHighlightLocal();
        return;
    }

    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();

    //подсветка фигуры при клике
    selfHighlight(piece);
    hightlight_state = true;
    selfHighlightState = piece;

    //фигура для динамического движения
    moveState = piece;

    const current_pos = piece.current_position;
    const flatArray = globalState.flat();

    //иницилизация позиции для передвижения
    if (current_pos[1] === "7") {
        //начальная позиция
        let hightlightSquareIds = [
            `${current_pos[0]}${Number(current_pos[1]) - 1}`,
            `${current_pos[0]}${Number(current_pos[1]) - 2}`,
        ];

        hightlightSquareIds = checkSquareCaptureId(hightlightSquareIds);

        hightlightSquareIds.forEach(hightlight => {
            const element = keySquareMapper[hightlight];
            element.highlight = true;
        });

        globalStateRender();
    } else {
        const col1 = `${String.fromCharCode(current_pos[0].charCodeAt(0) - 1)}${
            Number(current_pos[1]) - 1
        }`;
        const col2 = `${String.fromCharCode(current_pos[0].charCodeAt(0) + 1)}${
            Number(current_pos[1]) - 1
        }`;

        let captureIds = [col1, col2];
        // captureIds = checkSquareCaptureId(captureIds);

        //с той же позиции
        const hightlightSquareIds = [
            `${current_pos[0]}${Number(current_pos[1]) - 1}`,
        ];

        captureIds.forEach(element => {
            checkPieceOfOpponentOnElement(element, "black");
        });

        hightlightSquareIds.forEach(hightlight => {
            const element = keySquareMapper[hightlight];
            element.highlight = true;
        });

        globalStateRender();
    }
}

function clearPreviousSelfHighlight(piece) {
    if (piece) {
        document
            .getElementById(piece.current_position)
            .classList.remove("hightlightYellow");
        selfHighlightState = null;
    }
}

function GlobalEvent() {
    ROOT_DIV.addEventListener("click", function (event) {
        if (event.target.localName === "img") {
            const clickId = event.target.parentNode.id;

            const square = keySquareMapper[clickId];

            if (square && square.piece && square.piece.piece_name) {
                if (
                    (square.piece.piece_name.includes("white") &&
                        inTurn === "black") ||
                    (square.piece.piece_name.includes("black") &&
                        inTurn === "white")
                ) {
                    captureInTurn(square);
                    return;
                }
            }

            if (square.piece.piece_name == "white_pawn") {
                if (inTurn == "white") whitePawnClick(square);
            } else if (square.piece.piece_name == "black_pawn") {
                if (inTurn == "black") blackPawnClick(square);
            } else if (square.piece.piece_name == "white_bishop") {
                if (inTurn == "white") whiteBishopClick(square);
            } else if (square.piece.piece_name == "black_bishop") {
                if (inTurn == "black") blackBishopClick(square);
            } else if (square.piece.piece_name == "white_rook") {
                if (inTurn == "white") whiteRookClick(square);
            } else if (square.piece.piece_name == "black_rook") {
                if (inTurn == "black") blackRookClick(square);
            } else if (square.piece.piece_name == "white_knight") {
                if (inTurn == "white") whiteKnightClick(square);
            } else if (square.piece.piece_name == "black_knight") {
                if (inTurn == "black") blackKnightClick(square);
            } else if (square.piece.piece_name == "white_queen") {
                if (inTurn == "white") whiteQueenClick(square);
            } else if (square.piece.piece_name == "black_queen") {
                if (inTurn == "black") blackQueenClick(square);
            } else if (square.piece.piece_name == "white_king") {
                if (inTurn == "white") whiteKingClick(square);
            } else if (square.piece.piece_name == "black_king") {
                if (inTurn == "black") blackKingClick(square);
            }
        } else {
            const childElementsOfclickedEl = Array.from(
                event.target.childNodes
            );

            if (
                childElementsOfclickedEl.length == 1 ||
                event.target.localName == "span"
            ) {
                if (event.target.localName == "span") {
                    clearPreviousSelfHighlight(selfHighlightState);
                    const id = event.target.parentNode.id;
                    moveElement(moveState, id);
                    moveState = null;
                } else {
                    clearPreviousSelfHighlight(selfHighlightState);
                    const id = event.target.id;
                    moveElement(moveState, id);
                    moveState = null;
                }
            } else {
                //очистка подсветки
                clearHighlightLocal();
                clearPreviousSelfHighlight(selfHighlightState);
            }
        }
    });
}

export { GlobalEvent, movePieceFromXToY };
