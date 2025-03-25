import { ROOT_DIV } from "../Helper/constants.js";
import { globalState, keySquareMapper } from "../index.js";
import {
    globalStateRender,
    clearHightlight,
    selfHighlight,
    globalPiece,
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
    giveKingCaptureIds,
    giveKnightCaptureIds,
    giveBishopCaptureIds,
    giveRookCaptureIds,
    giveQueenCaptureIds,
} from "../Helper/commonHelper.js";
// import logMoves from "../Helper/logging.js";
import pawnPromotion from "../Helper/modalCreator.js";

//подсветить или нет (стейт)
let hightlight_state = false;
let inTurn = "white";
let whoInCheck = null;

function changeTurn() {
    inTurn = inTurn === "white" ? "black" : "white";
}

function checkForCheck() {
    if (inTurn === "black") {
        const whiteKingCurrentPosition =
            globalPiece.white_king.current_position;
        const knight_1 = globalPiece.black_knight_1.current_position;
        const knight_2 = globalPiece.black_knight_2.current_position;
        const king = globalPiece.black_king.current_position;
        const bishop_1 = globalPiece.black_bishop_1.current_position;
        const bishop_2 = globalPiece.black_bishop_2.current_position;
        const rook_1 = globalPiece.black_rook_1.current_position;
        const rook_2 = globalPiece.black_rook_2.current_position;
        const queen = globalPiece.black_queen.current_position;

        let finalCheckList = [];
        finalCheckList.push(giveKnightCaptureIds(knight_1, inTurn));
        finalCheckList.push(giveKnightCaptureIds(knight_2, inTurn));
        finalCheckList.push(giveKingCaptureIds(king, inTurn));
        finalCheckList.push(giveBishopCaptureIds(bishop_1, inTurn));
        finalCheckList.push(giveBishopCaptureIds(bishop_2, inTurn));
        finalCheckList.push(giveRookCaptureIds(rook_1, inTurn));
        finalCheckList.push(giveRookCaptureIds(rook_2, inTurn));
        finalCheckList.push(giveQueenCaptureIds(queen, inTurn));

        finalCheckList = finalCheckList.flat();
        const checkOrNot = finalCheckList.find(
            element => element === whiteKingCurrentPosition
        );
        if (checkOrNot) {
            whoInCheck = "white";
        }
    } else {
        const blackKingCurrentPosition =
            globalPiece.black_king.current_position;
        const knight_1 = globalPiece.white_knight_1.current_position;
        const knight_2 = globalPiece.white_knight_2.current_position;
        const king = globalPiece.white_king.current_position;
        const bishop_1 = globalPiece.white_bishop_1.current_position;
        const bishop_2 = globalPiece.white_bishop_2.current_position;
        const rook_1 = globalPiece.white_rook_1.current_position;
        const rook_2 = globalPiece.white_rook_2.current_position;
        const queen = globalPiece.white_queen.current_position;

        let finalCheckList = [];
        finalCheckList.push(giveKnightCaptureIds(knight_1, inTurn));
        finalCheckList.push(giveKnightCaptureIds(knight_2, inTurn));
        finalCheckList.push(giveKingCaptureIds(king, inTurn));
        finalCheckList.push(giveBishopCaptureIds(bishop_1, inTurn));
        finalCheckList.push(giveBishopCaptureIds(bishop_2, inTurn));
        finalCheckList.push(giveRookCaptureIds(rook_1, inTurn));
        finalCheckList.push(giveRookCaptureIds(rook_2, inTurn));
        finalCheckList.push(giveQueenCaptureIds(queen, inTurn));

        finalCheckList = finalCheckList.flat();
        const checkOrNot = finalCheckList.find(
            element => element === blackKingCurrentPosition
        );
        if (checkOrNot) {
            whoInCheck = "black";
        }
    }
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

function checkForPawnPromotion(piece, id) {
    if (!piece?.piece_name) return false; // Если фигура undefined или не имеет имени

    if (piece.piece_name.toLowerCase().includes("pawn")) {
        const row = id[id.length - 1]; // Последняя цифра в id (номер строки)
        if (
            (inTurn === "white" && row === "8") ||
            (inTurn === "black" && row === "1")
        ) {
            return true;
        }
    }
    return false;
}

function callbackPawnPromotion(piece, id) {
    const realPiece = piece(id);
    const currentSquare = keySquareMapper[id];
    piece.current_position = id;
    currentSquare.piece = realPiece;
    const image = document.createElement("img");
    image.src = realPiece.img;
    image.classList.add("piece");

    const currentElement = document.getElementById(id);
    currentElement.innerHTML = "";
    currentElement.append(image);
}

//динамическое передвижение фигур благодаря айдишникам
function moveElement(piece, id) {
    const shouldPromote = checkForPawnPromotion(piece, id);

    if (
        piece.piece_name.includes("king") ||
        piece.piece_name.includes("rook")
    ) {
        piece.move = true;

        if (
            piece.piece_name.includes("king") &&
            piece.piece_name.includes("black")
        ) {
            if (id === "c8" || id === "g8") {
                let rook = keySquareMapper[id === "c8" ? "a8" : "h8"];
                moveElement(rook.piece, id === "c8" ? "d8" : "f8");
            }
        }
    }

    if (
        piece.piece_name.includes("king") ||
        piece.piece_name.includes("rook")
    ) {
        piece.move = true;

        if (
            piece.piece_name.includes("king") &&
            piece.piece_name.includes("white")
        ) {
            if (id === "c1" || id === "g1") {
                let rook = keySquareMapper[id === "c1" ? "a1" : "h1"];
                moveElement(rook.piece, id === "c1" ? "d1" : "f1");
            }
        }
    }

    const flatData = globalState.flat();

    flatData.forEach(el => {
        if (el.id == piece.current_position) {
            delete el.piece;
        }
        if (el.id == id) {
            if (el.piece) {
                el.piece.current_position = null;
            }
            el.piece = piece;
        }
    });

    clearHightlight();

    // Получаем элемент предыдущей позиции
    const previousPiece = document.getElementById(piece.current_position);
    if (previousPiece) {
        previousPiece.classList.remove("hightlightYellow");

        // Получаем изображение фигуры
        const pieceImage = previousPiece.querySelector("img");
        if (pieceImage) {
            // Получаем элемент текущей позиции
            const currentPiece = document.getElementById(id);
            if (currentPiece) {
                currentPiece.innerHTML = ""; // Очищаем поле перед вставкой
                currentPiece.appendChild(pieceImage);
            } else {
                console.error(`Элемент с id="${id}" не найден.`);
            }
        } else {
            console.error("Фигура в previousPiece не найдена.");
        }
    } else {
        console.error(`Элемент с id="${piece.current_position}" не найден.`);
    }

    piece.current_position = id;

    if (shouldPromote) {
        pawnPromotion(inTurn, callbackPawnPromotion, id);
    }

    checkForCheck();
    changeTurn();
}

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

    if (!piece.move) {
        const rook1 = globalPiece.white_rook_1;
        const rook2 = globalPiece.white_rook_2;
        if (!rook1.move) {
            const b1 = keySquareMapper["b1"];
            const c1 = keySquareMapper["c1"];
            const d1 = keySquareMapper["d1"];
            if (!b1.piece && !c1.piece && !d1.piece) {
                result.push("c1");
            }
        }
        if (!rook2.move) {
            const f1 = keySquareMapper["f1"];
            const g1 = keySquareMapper["g1"];
            if (!f1.piece && !g1.piece) {
                result.push("g1");
            }
        }
    }

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

    if (!piece.move) {
        const rook1 = globalPiece.black_rook_1;
        const rook2 = globalPiece.black_rook_2;
        if (!rook1.move) {
            const b8 = keySquareMapper["b8"];
            const c8 = keySquareMapper["c8"];
            const d8 = keySquareMapper["d8"];
            if (!b8.piece && !c8.piece && !d8.piece) {
                result.push("c8");
            }
        }
        if (!rook2.move) {
            const f8 = keySquareMapper["f8"];
            const g8 = keySquareMapper["g8"];
            if (!f8.piece && !g8.piece) {
                result.push("g8");
            }
        }
    }

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
