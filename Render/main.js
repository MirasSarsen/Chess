import * as piece from "../Data/pieces.js";
import { ROOT_DIV } from "../Helper/constants.js";
import { globalState } from "../index.js";

//функция для рендера фигур из globalStateData (используется для обновления globalState)
function globalStateRender() {
    globalState.forEach(row => {
        row.forEach(element => {
            if (element.highlight) {
                const hightlightSpan = document.createElement("span");
                hightlightSpan.classList.add("hightlight");
                document.getElementById(element.id).appendChild(hightlightSpan);
            } else if (element.highlight === null) {
                const el = document.getElementById(element.id);
                const highlights = Array.from(el.getElementsByTagName("span"));
                highlights.forEach(element => {
                    el.removeChild(element);
                });
            }
            if (element.piece != null) {
            }
        });
    });
}

//динамическое передвижение фигур благодаря айдишникам
function moveElement(piece, id) {
    const flatData = globalState.flat();

    flatData.forEach(el => {
        if (el.id == piece.current_position) {
            delete el.piece;
        }

        if (el.id == id) {
            el.piece = piece;
        }
    });

    clearHightlight();
    const previousPiece = document.getElementById(piece.current_position);
    previousPiece.classList.remove("hightlightYellow");
    const currentPiece = document.getElementById(id);
    currentPiece.innerHTML = previousPiece.innerHTML;
    previousPiece.innerHTML = "";

    piece.current_position = id;
}

function clearPreviousSelfHighlight(piece) {
    if (piece) {
        document
            .getElementById(piece.current_position)
            .classList.remove("hightlightYellow");
    }
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
            // в квадрате может быть фигура
            if (square.piece) {
                const squareEl = document.getElementById(square.id);

                // создание фигуры
                const piece = document.createElement("img");
                piece.src = square.piece.img;
                piece.classList.add("piece");

                // переместить фигуру в доску шахмат
                squareEl.appendChild(piece);
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

            // рендер белых
            if (square.id[1] == 2) {
                square.piece = piece.whitePawn(square.id);
            }

            if (square.id == "a1" || square.id == "h1") {
                square.piece = piece.whiteRook(square.id);
            }

            if (square.id == "b1" || square.id == "g1") {
                square.piece = piece.whiteKnight(square.id);
            }

            if (square.id == "c1" || square.id == "f1") {
                square.piece = piece.whiteBishop(square.id);
            }

            if (square.id == "e1") {
                square.piece = piece.whiteKing(square.id);
            }

            if (square.id == "d1") {
                square.piece = piece.whiteQueen(square.id);
            }

            // рендер черных
            if (square.id[1] == 7) {
                square.piece = piece.blackPawn(square.id);
            }

            if (square.id == "a8" || square.id == "h8") {
                square.piece = piece.blackRook(square.id);
            }

            if (square.id == "b8" || square.id == "g8") {
                square.piece = piece.blackKnight(square.id);
            }

            if (square.id == "c8" || square.id == "f8") {
                square.piece = piece.blackBishop(square.id);
            }

            if (square.id == "e8") {
                square.piece = piece.blackKing(square.id);
            }

            if (square.id == "d8") {
                square.piece = piece.blackQueen(square.id);
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
        // if (el.captureHighlight) {
        //     document.getElementById(el.id).classList.remove("captureColor");
        // }

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
    clearPreviousSelfHighlight,
    moveElement,
    globalStateRender,
};
