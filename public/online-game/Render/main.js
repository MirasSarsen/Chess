import * as piece from "../Data/pieces.js";
import { ROOT_DIV } from "../Helper/constants.js";
import { globalState } from "../index.js";
import {
    isInCheck,
    isCheckmate,
    filterLegalMoves,
} from "../Helper/checkmateHelper.js";
import { getValidMoves } from "../Helper/checkmateHelper.js";
import { getAttackedSquares } from "../Helper/commonHelper.js";
import { moveElement } from "../Events/global.js";

const globalPiece = new Object();

function givePawnCaptureIds(pos, color) {
    const file = pos[0];
    const rank = parseInt(pos[1]);

    const direction = color === "white" ? 1 : -1;
    const left =
        String.fromCharCode(file.charCodeAt(0) - 1) + (rank + direction);
    const right =
        String.fromCharCode(file.charCodeAt(0) + 1) + (rank + direction);

    return [left, right];
}

function checkCheckmateStatus(currentTurn) {
    const opponentTurn = currentTurn === "white" ? "black" : "white";

    const attackedKing = globalPiece[`${opponentTurn}_king`];
    if (!attackedKing || !attackedKing.current_position) {
        console.warn(
            `${opponentTurn} король отсутствует. Проверка шаха невозможна.`
        );
        return;
    }

    if (isInCheck(opponentTurn)) {
        console.log(`Шах ${opponentTurn}!`);

        if (isCheckmate(opponentTurn)) {
            console.log(`Мат ${opponentTurn}! Игра окончена.`);
            alert(`Мат ${opponentTurn}!`);
        }
    }
}

//функция для рендера фигур из globalStateData (используется для обновления globalState)
function globalStateRender() {
    globalState.forEach(row => {
        row.forEach(element => {
            const el = document.getElementById(element.id);

            // Очистка обычной подсветки
            const existingHighlights = el.querySelectorAll(".hightlight");
            existingHighlights.forEach(h => h.remove());

            // Очистка шах-подсветки
            el.classList.remove("dangerHighlight");

            // Подсветка возможных ходов
            if (element.highlight) {
                const hightlightSpan = document.createElement("span");
                hightlightSpan.classList.add("hightlight");
                el.appendChild(hightlightSpan);
            }

            // Подсветка шаха
            if (
                element.piece &&
                element.piece.piece_name.includes("king") &&
                isInCheck(element.piece.color)
            ) {
                el.classList.add("dangerHighlight");
            }
        });
    });
}

function selfHighlight(piece) {
    document
        .getElementById(piece.current_position)
        .classList.add("hightlightYellow");
}
// использует рендер любых из фигур в доску
function pieceRender(data) {
    data.forEach(row => {
        row.forEach(square => {
            if (square.piece) {
                const squareEl = document.getElementById(square.id);
                const pieceImg = document.createElement("img");
                pieceImg.src = square.piece.img;
                pieceImg.classList.add("piece");

                squareEl.appendChild(pieceImg);
            }
        });
    });
}

// использует рендер доски за первое время запуск игры
function initGameRender(data) {
    data.forEach(element => {
        const rowEl = document.createElement("div");
        element.forEach(square => {
            const squareDiv = document.createElement("div");

            squareDiv.id = square.id;
            squareDiv.classList.add(square.color, "square");

            squareDiv.style.position = "relative"; // ВАЖНО для координат

            const file = square.id[0]; // буква (a-h)
            const rank = square.id[1]; // цифра (1-8)

            // Координаты — слева
            if (file === "a") {
                const rankLeft = document.createElement("div");
                rankLeft.classList.add("coord", "rank", "left");
                rankLeft.textContent = rank;
                squareDiv.appendChild(rankLeft);
            }

            // Координаты — снизу
            if (rank === "1") {
                const fileBottom = document.createElement("div");
                fileBottom.classList.add("coord", "file", "bottom");
                fileBottom.textContent = file;
                squareDiv.appendChild(fileBottom);
            }

            // рендер белых
            if (square.id[1] == 2) {
                square.piece = piece.whitePawn(square.id);
                globalPiece.white_pawn = square.piece;
            }

            if (square.id == "a1" || square.id == "h1") {
                square.piece = piece.whiteRook(square.id);
                
                if (globalPiece.white_rook_1) {
                    globalPiece.white_rook_2 = square.piece;
                } else {
                    globalPiece.white_rook_1 = square.piece;
                }
            }

            if (square.id == "b1" || square.id == "g1") {
                square.piece = piece.whiteKnight(square.id);
                if (globalPiece.white_knight_1) {
                    globalPiece.white_knight_2 = square.piece;
                } else {
                    globalPiece.white_knight_1 = square.piece;
                }
            }

            if (square.id == "c1" || square.id == "f1") {
                square.piece = piece.whiteBishop(square.id);
                if (globalPiece.white_bishop_1) {
                    globalPiece.white_bishop_2 = square.piece;
                } else {
                    globalPiece.white_bishop_1 = square.piece;
                }
            }

            if (square.id == "e1") {
                square.piece = piece.whiteKing(square.id);
                globalPiece.white_king = square.piece;
            }

            if (square.id == "d1") {
                square.piece = piece.whiteQueen(square.id);
                globalPiece.white_queen = square.piece;
            }

            // рендер черных
            if (square.id[1] == 7) {
                square.piece = piece.blackPawn(square.id);
                globalPiece.black_pawn = square.piece;
            }

            if (square.id == "a8" || square.id == "h8") {
                square.piece = piece.blackRook(square.id);
                if (globalPiece.black_rook_1) {
                    globalPiece.black_rook_2 = square.piece;
                } else {
                    globalPiece.black_rook_1 = square.piece;
                }
            }

            if (square.id == "b8" || square.id == "g8") {
                square.piece = piece.blackKnight(square.id);
                if (globalPiece.black_knight_1) {
                    globalPiece.black_knight_2 = square.piece;
                } else {
                    globalPiece.black_knight_1 = square.piece;
                }
            }

            if (square.id == "c8" || square.id == "f8") {
                square.piece = piece.blackBishop(square.id);
                if (globalPiece.black_bishop_1) {
                    globalPiece.black_bishop_2 = square.piece;
                } else {
                    globalPiece.black_bishop_1 = square.piece;
                }
            }

            if (square.id == "e8") {
                square.piece = piece.blackKing(square.id);
                globalPiece.black_king = square.piece;
            }

            if (square.id == "d8") {
                square.piece = piece.blackQueen(square.id);
                globalPiece.black_queen = square.piece;
            }

            rowEl.appendChild(squareDiv);
        });
        rowEl.classList.add("squareRow");
        ROOT_DIV.appendChild(rowEl);
    });

    pieceRender(data);
}

//рендер подсветки круга
function renderHightlight(squareId) {
    const hightlightSpan = document.createElement("span");
    hightlightSpan.classList.add("hightlight");
    document.getElementById(squareId).appendChild(hightlightSpan);
}

//убрать подсветку
function clearHightlight() {
    const flatData = globalState.flat();

    flatData.forEach(el => {
        if (el.captureHighlight) {
            document.getElementById(el.id).classList.remove("captureColor");
            el.captureHighlight = false;
        }

        if (el.highlight) {
            el.highlight = null;
        }

        globalStateRender();
    });
}

export {
    initGameRender,
    renderHightlight,
    clearHightlight,
    selfHighlight,
    globalStateRender,
    globalPiece,
    checkCheckmateStatus,
};
