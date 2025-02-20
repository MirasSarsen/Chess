import { ROOT_DIV } from "../Helper/constants.js";
import { globalState } from "../index.js";
import { renderHightlight } from "../Render/main.js";
import { clearHightlight } from "../Render/main.js";
import { selfHighlight } from "../Render/main.js";
import { clearPreviousSelfHighlight } from "../Render/main.js";
import { moveElement } from "../Render/main.js";

//подсветить или нет (стейт)
let hightlight_state = false;

//правильное состояние подсветки (то есть, чтобы очищать фон с посл клика)
let selfHighlightState = null;

//состояние для динамического движения
let moveState = null;

//логика белых пешек
function whitePawnClick({ piece }) {
    //очищать фон с клика в любое место доски
    if (piece == selfHighlightState) {
        clearPreviousSelfHighlight(selfHighlightState);
        selfHighlightState = null;
        clearHightlight();
        return;
    }
    //подсветка фигуры при клике
    selfHighlight(piece);
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
        clearHightlight();
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
            `${current_pos[0]}${Number(current_pos[1]) + 1}`,
        ];

        //очистить доску для любого предыдущего хода
        clearHightlight();
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
    //очищать фон с клика в любое место доски
    if (piece == selfHighlightState) {
        clearPreviousSelfHighlight(selfHighlightState);
        selfHighlightState = null;
        clearHightlight();
        return;
    }
    //подсветка фигуры при клике
    selfHighlight(piece);
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
        clearHightlight();
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
        clearHightlight();
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
                //очистка подсветки после первого хода (чтобы не кликать второй раз после хода)
                clearHightlight();
                clearPreviousSelfHighlight(selfHighlightState);
                selfHighlightState = null;
            } else {
                //очистка подсветки
                clearHightlight();
                clearPreviousSelfHighlight(selfHighlightState);
                selfHighlightState = null;
            }
        }
    });
}

export { GlobalEvent };
