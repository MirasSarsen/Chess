import { ROOT_DIV } from "../Helper/constants.js";
import { globalState, keySquareMapper } from "../index.js";
import {
    globalStateRender,
    clearHightlight,
    selfHighlight,
    globalPiece,
} from "../Render/main.js";
import { isInCheck } from "../Helper/checkmateHelper.js";
import {
    isCheckmate,
    showCheckIfKing,
    checkGameEnd,
} from "../Helper/checkmateHelper.js";
import {
    checkPieceOfOpponentOnElement,
    checkSquareCaptureId,
    giveBishopHighlightIds,
    checkWeatherPieceExistsOrNot,
    giveRookHighlightIds,
    giveKnightHighlightIds,
    giveKingHighlightIds,
    getAttackedSquares,
} from "../Helper/commonHelper.js";
// import logMoves from "../Helper/logging.js";
import pawnPromotion from "../Helper/modalCreator.js";

let hightlight_state = false;
let inTurn = "white";
let whoInCheck = null;

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
        moveElement(selfHighlightState, piece.current_position);
        clearPreviousSelfHighlight(selfHighlightState);
        clearHighlightLocal();
        return;
    }
}

function checkForPawnPromotion(piece, id) {
    if (!piece?.piece_name) return false;

    if (piece.piece_name.toLowerCase().includes("pawn")) {
        const row = id[id.length - 1];
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
function moveElement(piece, id, internalMove = false) {
    if (!internalMove) {
        if (!piece || !keySquareMapper[id]) return;

        const targetSquare = keySquareMapper[id];
        const movingColor = piece.piece_name.startsWith("white")
            ? "white"
            : "black";

        const targetColor = targetSquare?.piece?.piece_name?.startsWith("white")
            ? "white"
            : "black";

        if (targetSquare?.piece && movingColor === targetColor) return;

        // Создаём клон состояния с сохранением color
        const clonedState = globalState.map(row =>
            row.map(cell => ({
                id: cell.id,
                piece: cell.piece ? { ...cell.piece } : null,
                color: cell.color,
            }))
        );
        console.log(
            "Атакуемые клетки",
            movingColor,
            getAttackedSquares(movingColor, clonedState)
        );

        const from = clonedState
            .flat()
            .find(el => el.id === piece.current_position);
        const to = clonedState.flat().find(el => el.id === id);

        to.piece = from.piece;
        from.piece = null;

        // Проверка, попадёт ли король под шах
        const kingSquare = clonedState
            .flat()
            .find(sq => sq.piece?.piece_name === `${movingColor}_king`);

        if (kingSquare) {
            const attacked = getAttackedSquares(
                movingColor === "white" ? "black" : "white",
                clonedState
            );
            if (attacked.includes(kingSquare.id)) {
                console.log("Ход невозможен: король будет под шахом");
                return;
            }
        }
    }

    const shouldPromote = checkForPawnPromotion(piece, id);
    const targetPiece = keySquareMapper[id]?.piece;

    // Запрет на поедание короля
    if (targetPiece?.piece_name.includes("king")) return;

    // Рокировка
    if (piece.piece_name.includes("king")) {
        if (piece.piece_name.includes("white")) {
            if (id === "c1")
                moveElement(keySquareMapper["a1"].piece, "d1", true);
            if (id === "g1")
                moveElement(keySquareMapper["h1"].piece, "f1", true);
        } else {
            if (id === "c8")
                moveElement(keySquareMapper["a8"].piece, "d8", true);
            if (id === "g8")
                moveElement(keySquareMapper["h8"].piece, "f8", true);
        }
    }

    // Обновление глобального состояния
    globalState.flat().forEach(el => {
        if (el.id === piece.current_position) delete el.piece;
        if (el.id === id) el.piece = piece;
    });

    const prevSquare = document.getElementById(piece.current_position);
    const targetSquare = document.getElementById(id);

    if (prevSquare && targetSquare) {
        prevSquare.classList.remove("hightlightYellow");
        const pieceImage = prevSquare.querySelector("img");
        if (pieceImage) {
            targetSquare.innerHTML = "";
            targetSquare.appendChild(pieceImage);
        }
    }

    piece.current_position = id;
    piece.move = true;
    clearHightlight();

    if (shouldPromote) {
        pawnPromotion(inTurn, callbackPawnPromotion, id);
    }

    if (!internalMove) {
        changeTurn();
        const nextPlayerColor = inTurn;

        if (isCheckmate(nextPlayerColor)) {
            alert("Мат " + nextPlayerColor + " — игра окончена.");
            return;
        }

        checkGameEnd(nextPlayerColor);
    }

    // Подсветка шаха
    const enemyColor = piece.piece_name.startsWith("white") ? "black" : "white";
    const enemyKingSquare = globalState
        .flat()
        .find(sq => sq.piece?.piece_name === `${enemyColor}_king`);

    if (enemyKingSquare) {
        const attackedNow = getAttackedSquares(
            inTurn === "white" ? "black" : "white",
            globalState
        );
        if (attackedNow.includes(enemyKingSquare.id)) {
            console.log("Шах!");
            document
                .getElementById(enemyKingSquare.id)
                ?.classList.add("highlightRed");
        }
    }
}

function filterLegalMoves(piece, moveList, globalState, getAttackedSquares) {
    const color = piece.piece_name.includes("white") ? "white" : "black";
    const opponent = color === "white" ? "black" : "white";

    const fromId = piece.current_position;

    const legal = [];

    for (const targetId of moveList) {
        // глубокая копия состояния доски
        const clone = JSON.parse(JSON.stringify(globalState));
        // найти в clone объекты клеток from и to
        const flat = clone.flat();
        const fromClone = flat.find(sq => sq.id === fromId);
        const toClone = flat.find(sq => sq.id === targetId);

        if (!fromClone) continue;
        // симуляция хода: переместить ссылку на piece
        // Примечание: в clone мы храним только данные о piece в globalState.
        toClone.piece = fromClone.piece;
        fromClone.piece = null;

        // найти в clone позицию короля этого цвета
        const kingSq = flat.find(
            sq => sq.piece?.piece_name === `${color}_king`
        );
        if (!kingSq) {
            // без короля – некорректно, но пропускаем
            continue;
        }
        // получить атакованные клетки противника на clone
        const attacked = getAttackedSquares(opponent, clone);
        // если после хода король не под атакой, ход легален
        if (!attacked.includes(kingSq.id)) {
            legal.push(targetId);
        }
    }
    return legal;
}

function handleWhitePieceClick(square, getRawMovesCallback) {
    const piece = square.piece;
    if (!piece) return;

    // Повторный клик на уже подсвеченной фигуре — снять подсветку
    if (piece === selfHighlightState) {
        clearPreviousSelfHighlight(selfHighlightState);
        clearHighlightLocal();
        return;
    }

    // Ход/поедание
    if (square.captureHighlight) {
        moveElement(selfHighlightState, piece.current_position);
        clearPreviousSelfHighlight(selfHighlightState);
        clearHighlightLocal();
        return;
    }

    // Очистка доски
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();

    // Подсветка выбранной фигуры
    selfHighlight(piece);
    hightlight_state = true;
    selfHighlightState = piece;
    moveState = piece;

    const rawMoves = getRawMovesCallback(
        piece.current_position,
        globalState,
        piece.color
    );

    // 🛑 Если под шахом, фильтруем возможные ходы
    const currentColor = "white";
    const legalMoves = isInCheck(currentColor)
        ? filterLegalMoves(piece, rawMoves, globalState, getAttackedSquares)
        : rawMoves;

    // Подсветка допустимых ходов
    legalMoves.forEach(id => {
        const square = keySquareMapper[id];
        if (square) square.highlight = true;
    });

    // Подсветка возможных взятий
    legalMoves.forEach(id => {
        checkPieceOfOpponentOnElement(id, currentColor);
    });

    globalStateRender();
}

function handleBlackPieceClick(square, getRawMovesCallback) {
    const piece = square.piece;
    if (!piece) return;

    if (piece === selfHighlightState) {
        clearPreviousSelfHighlight(selfHighlightState);
        clearHighlightLocal();
        return;
    }

    if (square.captureHighlight) {
        moveElement(selfHighlightState, piece.current_position);
        clearPreviousSelfHighlight(selfHighlightState);
        clearHighlightLocal();
        return;
    }

    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();

    selfHighlight(piece);
    hightlight_state = true;
    selfHighlightState = piece;
    moveState = piece;

    const currentColor = "black";
    const rawMoves = getRawMovesCallback(piece.current_position, globalState);
    const possibleMoves = Object.values(rawMoves).flat
        ? Object.values(rawMoves).flat()
        : rawMoves;

    const legalMoves = isInCheck(currentColor)
        ? filterLegalMoves(
              piece,
              possibleMoves,
              globalState,
              getAttackedSquares
          )
        : possibleMoves;

    // Подсветка доступных клеток
    legalMoves.forEach(id => {
        const square = keySquareMapper[id];
        if (square) square.highlight = true;
    });

    // Подсветка возможных взятий
    legalMoves.forEach(id => {
        checkPieceOfOpponentOnElement(id, currentColor);
    });

    globalStateRender();
}

function handleSelfOrCaptureClick(square, piece) {
    if (piece === selfHighlightState) {
        clearPreviousSelfHighlight(selfHighlightState);
        clearHighlightLocal();
        return true;
    }
    if (square.captureHighlight) {
        moveElement(selfHighlightState, square.id || piece.current_position);
        clearPreviousSelfHighlight(selfHighlightState);
        clearHighlightLocal();
        return true;
    }
    return false;
}

function highlightSquares(ids) {
    ids.forEach(id => {
        const element = keySquareMapper[id];
        if (element) element.highlight = true;
    });
}

//правильное состояние подсветки (то есть, чтобы очищать фон с посл клика)
let selfHighlightState = null;

//состояние для динамического движения
let moveState = null;

//локальная функция очистки подсветки
function clearHighlightLocal() {
    clearHightlight();
    hightlight_state = false;
    document.querySelectorAll(".checkHighlight").forEach(el => {
        el.classList.remove("checkHighlight");
    });
}

//передвижение фигуры относительно х-доски и у-доски
function movePieceFromXToY(from, to) {
    to.piece = from.piece;
    from.piece = null;
    globalStateRender();
}
function trimLineOnFirstPiece(arr, currentColor) {
    const result = [];

    for (const id of arr) {
        const square = keySquareMapper[id];
        if (!square) break;

        if (!square.piece) {
            result.push(id);
        } else {
            if (square.piece.color === currentColor) break; // своя — стоп
            result.push(id); // враг — можно съесть
            break;
        }
    }

    return result;
}

function bishopMovesWrapper(pos, color) {
    const dirs = giveBishopHighlightIds(pos);

    return [
        ...trimLineOnFirstPiece(dirs.topLeft, color),
        ...trimLineOnFirstPiece(dirs.topRight, color),
        ...trimLineOnFirstPiece(dirs.bottomLeft, color),
        ...trimLineOnFirstPiece(dirs.bottomRight, color),
    ];
}

function rookMovesWrapper(pos, color) {
    const dirs = giveRookHighlightIds(pos);

    return [
        ...trimLineOnFirstPiece(dirs.top, color),
        ...trimLineOnFirstPiece(dirs.bottom, color),
        ...trimLineOnFirstPiece(dirs.left, color),
        ...trimLineOnFirstPiece(dirs.right, color),
    ];
}

function queenMovesWrapper(pos) {
    return [...bishopMovesWrapper(pos), ...rookMovesWrapper(pos)];
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
        moveElement(selfHighlightState, square.id);
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

        const col1 = `${String.fromCharCode(current_pos[0].charCodeAt(0) - 1)}${
            Number(current_pos[1]) + 1
        }`;
        const col2 = `${String.fromCharCode(current_pos[0].charCodeAt(0) + 1)}${
            Number(current_pos[1]) + 1
        }`;

        let captureIds = [col1, col2];
        captureIds.forEach(id => {
            checkPieceOfOpponentOnElement(id, "white");
        });

        //с той же позиции
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
        captureIds.forEach(id => {
            checkPieceOfOpponentOnElement(id, "white");
        });

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
    handleWhitePieceClick(square, bishopMovesWrapper);
}

//логика белой ладьи
function whiteRookClick(square) {
    handleWhitePieceClick(square, rookMovesWrapper);
}

//логика белого коня
function whiteKnightClick(square) {
    handleWhitePieceClick(square, giveKnightHighlightIds);
}

//логика белого ферзя
function whiteQueenClick(square) {
    handleWhitePieceClick(square, queenMovesWrapper);
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
    handleBlackPieceClick(square, queenMovesWrapper);
}

//логика черного коня
function blackKnightClick(square) {
    handleBlackPieceClick(square, giveKnightHighlightIds);
}

//логика черной ладьи
function blackRookClick(square) {
    handleBlackPieceClick(square, rookMovesWrapper);
}

//логика черного слона
function blackBishopClick(square) {
    handleBlackPieceClick(square, bishopMovesWrapper);
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
        moveElement(selfHighlightState, square.id);
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

        const col1 = `${String.fromCharCode(current_pos[0].charCodeAt(0) - 1)}${
            Number(current_pos[1]) - 1
        }`;
        const col2 = `${String.fromCharCode(current_pos[0].charCodeAt(0) + 1)}${
            Number(current_pos[1]) - 1
        }`;

        let captureIds = [col1, col2];
        // captureIds = checkSquareCaptureId(captureIds);

        captureIds.forEach(element => {
            checkPieceOfOpponentOnElement(element, "black");
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

            const myTurn = inTurn; // чей сейчас ход
            if (isInCheck(myTurn)) {
                const moveList = getRawMoves(clickedPiece); // получить обычные ходы (до фильтрации)
                const legalMoves = filterLegalMoves(
                    clickedPiece,
                    moveList,
                    globalState,
                    getAttackedSquares
                );

                if (legalMoves.length === 0) {
                    console.log(
                        "Фигура не может спасти от шаха. Ход запрещён."
                    );
                    return;
                }

                // Подсветить только legalMoves
                highlightMoves(legalMoves);
            }

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
                clearPreviousSelfHighlight(selfHighlightState);

                const id =
                    event.target.localName == "span"
                        ? event.target.parentNode.id
                        : event.target.id;

                if (moveState) {
                    moveElement(moveState, id);
                } else {
                    console.warn("Попытка хода без выбранной фигуры");
                }

                moveState = null;
            } else {
                // очистка подсветки
                clearHighlightLocal();
                clearPreviousSelfHighlight(selfHighlightState);
            }
        }
    });
}

export { GlobalEvent, movePieceFromXToY };
