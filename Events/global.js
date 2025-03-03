import { ROOT_DIV } from "../Helper/constants.js";
import { globalState, keySquareMapper } from "../index.js";
import {
    globalStateRender,
    renderHightlight,
    moveElement,
    clearHightlight,
    selfHighlight,
} from "../Render/main.js";
import {
    checkPieceOfOpponentOnElement,
    checkSquareCaptureId,
    giveBishopHighlightIds,
} from "../Helper/commonHelper.js";
import { whiteBishop } from "../Data/pieces.js";

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

    let hightlightSquareIds = giveBishopHighlightIds(current_pos);

    const { bottomLeft, topLeft, bottomRight, topRight } = hightlightSquareIds;

    let result = [];
    result.push(checkSquareCaptureId(bottomLeft));
    result.push(checkSquareCaptureId(topLeft));
    result.push(checkSquareCaptureId(bottomRight));
    result.push(checkSquareCaptureId(topRight));

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

    const col1 = `${String.fromCharCode(current_pos[0].charCodeAt(0) - 1)}${
        Number(current_pos[1]) + 1
    }`;
    const col2 = `${String.fromCharCode(current_pos[0].charCodeAt(0) + 1)}${
        Number(current_pos[1]) + 1
    }`;

    let captureIds = [col1, col2];

    captureIds.forEach(element => {
        checkPieceOfOpponentOnElement(element, "white");
    });

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

    let hightlightSquareIds = giveBishopHighlightIds(current_pos);

    const { bottomLeft, topLeft, bottomRight, topRight } = hightlightSquareIds;

    let result = [];
    result.push(checkSquareCaptureId(bottomLeft));
    result.push(checkSquareCaptureId(topLeft));
    result.push(checkSquareCaptureId(bottomRight));
    result.push(checkSquareCaptureId(topRight));

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

    const col1 = `${String.fromCharCode(current_pos[0].charCodeAt(0) - 1)}${
        Number(current_pos[1]) + 1
    }`;
    const col2 = `${String.fromCharCode(current_pos[0].charCodeAt(0) + 1)}${
        Number(current_pos[1]) + 1
    }`;

    let captureIds = [col1, col2];

    captureIds.forEach(element => {
        checkPieceOfOpponentOnElement(element, "black");
    });

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
            // const flatArray = globalState.flat();
            // const square = flatArray.find(el => el.id == clickId);
            const square = keySquareMapper[clickId];
            if (square.piece.piece_name == "white_pawn") {
                whitePawnClick(square);
            } else if (square.piece.piece_name == "black_pawn") {
                blackPawnClick(square);
            } else if (square.piece.piece_name == "white_bishop") {
                whiteBishopClick(square);
            } else if (square.piece.piece_name == "black_bishop") {
                blackBishopClick(square);
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
