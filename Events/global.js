import { ROOT_DIV } from "../Helper/constants.js";
import { globalState } from "../index.js";
import { globalStateRender, renderHightlight } from "../Render/main.js";
import { clearHightlight } from "../Render/main.js";
import { selfHighlight } from "../Render/main.js";
import { clearPreviousSelfHighlight } from "../Render/main.js";
import { moveElement } from "../Render/main.js";
import { checkPieceOfOpponentOnElement } from "../Helper/commonHelper.js";

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
function movePieceFromXToY(from, to) {}

//логика белых пешек
function whitePawnClick({ piece }) {
    globalStateRender();

    if (hightlight_state) return;

    clearPreviousSelfHighlight(selfHighlightState);

    //очищать фон с клика в любое место доски
    if (piece == selfHighlightState) {
        clearPreviousSelfHighlight(selfHighlightState);
        selfHighlightState = null;
        clearHighlightLocal();
        return;
    }
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
        const hightlightSquareIds = [
            `${current_pos[0]}${Number(current_pos[1]) + 1}`,
            `${current_pos[0]}${Number(current_pos[1]) + 2}`,
        ];

        //очистить доску для любого предыдущего хода
        clearHighlightLocal();
        hightlightSquareIds.forEach(hightlight => {
            globalState.forEach(row => {
                row.forEach(element => {
                    if (element.id == hightlight) {
                        element.highlight(true);
                    }
                });
            });
        });
    } else {
        const col1 = `${String.fromCharCode(current_pos[0].charCodeAt(0) - 1)}${
            Number(current_pos[1]) + 1
        }`;
        const col2 = `${String.fromCharCode(current_pos[0].charCodeAt(0) + 1)}${
            Number(current_pos[1]) + 1
        }`;

        console.log(checkPieceOfOpponentOnElement(col1, "white"));
        console.log(checkPieceOfOpponentOnElement(col2, "white"));

        const captureIds = [col1, col2];

        //с той же позиции
        const hightlightSquareIds = [
            `${current_pos[0]}${Number(current_pos[1]) + 1}`,
        ];

        captureIds.forEach(element => {
            checkPieceOfOpponentOnElement(element, "white");
        });

        hightlightSquareIds.forEach(hightlight => {
            globalState.forEach(row => {
                row.forEach(element => {
                    if (element.id == hightlight) {
                        element.highlight(true);
                    }
                });
            });
        });
    }
}

//логика черных пешек
function blackPawnClick({ piece }) {
    globalStateRender();

    if (hightlight_state) {
        movePieceFromXToY(selfHighlightState, piece);
        return;
    }

    clearPreviousSelfHighlight(selfHighlightState);

    //очищать фон с клика в любое место доски
    if (piece == selfHighlightState) {
        clearPreviousSelfHighlight(selfHighlightState);
        selfHighlightState = null;
        clearHighlightLocal();
        return;
    }
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
        const hightlightSquareIds = [
            `${current_pos[0]}${Number(current_pos[1]) - 1}`,
            `${current_pos[0]}${Number(current_pos[1]) - 2}`,
        ];

        //очистить доску для любого предыдущего хода
        clearHighlightLocal();
        hightlightSquareIds.forEach(hightlight => {
            globalState.forEach(row => {
                row.forEach(element => {
                    if (element.id == hightlight) {
                        element.highlight(true);
                    }
                });
            });
        });
    } else {
        //с той же позиции
        const hightlightSquareIds = [
            `${current_pos[0]}${Number(current_pos[1]) - 1}`,
        ];

        //очистить доску для любого предыдущего хода
        clearHighlightLocal();
        hightlightSquareIds.forEach(hightlight => {
            globalState.forEach(row => {
                row.forEach(element => {
                    if (element.id == hightlight) {
                        element.highlight(true);
                    }
                });
            });
        });
    }
}

function GlobalEvent() {
    ROOT_DIV.addEventListener("click", function (event) {
        if (event.target.localName === "img") {
            const clickId = event.target.parentNode.id;
            const flatArray = globalState.flat();
            const square = flatArray.find(el => el.id == clickId);
            if (square.piece.piece_name == "white_pawn") {
                whitePawnClick(square);
            } else if (square.piece.piece_name == "black_pawn") {
                blackPawnClick(square);
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
                    const id = event.target.parentNode.id;
                    moveElement(moveState, id);
                    moveState = null;
                } else {
                    const id = event.target.id;
                    moveElement(moveState, id);
                    moveState = null;
                }
            } else {
                //очистка подсветки
                clearHighlightLocal();
                clearPreviousSelfHighlight(selfHighlightState);
                selfHighlightState = null;
            }
        }
    });
}

export { GlobalEvent };
