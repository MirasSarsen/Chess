import { globalPiece } from "../Render/main.js";
import {
    giveKnightCaptureIds,
    giveKingCaptureIds,
    giveBishopCaptureIds,
    giveRookCaptureIds,
    giveQueenCaptureIds,
    checkWeatherPieceExistsOrNot,
    giveKnightHighlightIds,
    giveKingHighlightIds,
    giveBishopHighlightIds,
    giveRookHighlightIds,
    giveQueenHighlightIds,
    getAttackedSquares,
} from "./commonHelper.js";
import { keySquareMapper } from "../index.js";

// Pawn capture logic (только по диагонали)
function givePawnCaptureIds(pos, color) {
    const file = pos[0];
    const rank = parseInt(pos[1]);
    const direction = color === "white" ? 1 : -1;
    const left =
        String.fromCharCode(file.charCodeAt(0) - 1) + (rank + direction);
    const right =
        String.fromCharCode(file.charCodeAt(0) + 1) + (rank + direction);

    const result = [];

    [left, right].forEach(squareId => {
        const square = keySquareMapper[squareId];
        if (square?.piece && square.piece.color !== color) {
            result.push(squareId);
        }
    });

    return result;
}

function cloneState(state) {
    return state.map(row =>
        row.map(cell => ({
            ...cell,
            piece: cell.piece ? { ...cell.piece } : null,
        }))
    );
}

export function filterLegalMoves(piece, candidateMoves, globalState) {
    const legalMoves = [];

    for (const targetId of candidateMoves) {
        // создаём копию текущего состояния
        const clonedState = cloneState(globalState);

        // симулируем перемещение фигуры в клонированной версии
        simulateMove(clonedState, piece.current_position, targetId);

        // если после такого хода игрок не под шахом — ход легален
        if (!isInCheck(piece.color, clonedState)) {
            legalMoves.push(targetId);
        }
    }

    return legalMoves;
}

function getEnemyAttackSquares(color) {
    const enemyColor = color === "white" ? "black" : "white";
    const squares = [];

    const enemyPieces = Object.values(globalPiece).filter(
        p => p.color === enemyColor && p.current_position
    );

    for (const p of enemyPieces) {
        let moves = [];

        if (p.piece_name.includes("pawn")) {
            moves = givePawnCaptureIds(p.current_position, p.color);
        } else if (p.getAttackedSquares) {
            moves = p.getAttackedSquares();
        }

        squares.push(...moves);
    }

    return squares;
}

function isInCheck(color) {
    const enemyColor = color === "white" ? "black" : "white";
    const kingPos = globalPiece[`${color}_king`]?.current_position;
    if (!kingPos) return false;

    const attackSquares = [];

    const enemyPieces = Object.values(globalPiece).filter(
        p => p?.color === enemyColor && p?.current_position
    );

    for (const p of enemyPieces) {
        let moves = [];

        if (p.piece_name.includes("pawn")) {
            moves = givePawnCaptureIds(p.current_position, p.color);
        } else if (p.getAttackedSquares) {
            moves = p.getAttackedSquares();
        }

        attackSquares.push(...moves);
    }

    return attackSquares.includes(kingPos);
}

function getAllPiecesOfColor(color) {
    return Object.values(globalPiece).filter(
        p => p.color === color && p.current_position
    );
}

function getValidMoves(piece, currentTurn) {
    const pos = piece.current_position;
    const enemyColor = currentTurn === "white" ? "black" : "white";

    if (!pos) return [];

    let rawMoves = [];

    switch (piece.type) {
        case "knight":
            rawMoves = giveKnightHighlightIds(pos, currentTurn);
            break;
        case "king":
            rawMoves = [
                ...giveKingCaptureIds(pos, currentTurn), // атакующие (например, съесть фигуру)
                // и дополнительно клетки вокруг
                ...[
                    [-1, -1],
                    [-1, 0],
                    [-1, 1],
                    [0, -1],
                    [0, 1],
                    [1, -1],
                    [1, 0],
                    [1, 1],
                ]
                    .map(([df, dr]) => {
                        const file = String.fromCharCode(
                            pos[0].charCodeAt(0) + df
                        );
                        const rank = parseInt(pos[1]) + dr;
                        const id = `${file}${rank}`;
                        return /^[a-h][1-8]$/.test(id) ? id : null;
                    })
                    .filter(Boolean),
            ];
            break;
        case "bishop":
            rawMoves = Object.values(
                giveBishopHighlightIds(pos, currentTurn)
            ).flat();
            break;
        case "rook":
            rawMoves = Object.values(
                giveRookHighlightIds(pos, currentTurn)
            ).flat();
            break;
        case "queen":
            rawMoves = Object.values(
                giveQueenHighlightIds(pos, currentTurn)
            ).flat();
            break;
        case "pawn":
            // TODO: сюда вставить обычные ходы пешки
            rawMoves = []; // пока отключено
            break;
        default:
            rawMoves = [];
    }

    // Если нет шаха — отдаем обычные ходы
    if (!isInCheck(currentTurn)) {
        return rawMoves;
    }

    // Но если шах — фильтруем только те ходы, которые **его снимают**
    const legalMoves = [];

    for (const move of rawMoves) {
        const prev = simulateMove(piece, move);
        const stillInCheck = isInCheck(currentTurn);
        undoSimulatedMove(prev);

        if (!stillInCheck) {
            legalMoves.push(move);
        }
    }

    return legalMoves;
}

function simulateMove(piece, targetSquare) {
    const pieceName = Object.keys(globalPiece).find(
        k => globalPiece[k] === piece
    );
    if (!pieceName) return null;

    const captured = Object.values(globalPiece).find(
        p => p.current_position === targetSquare && p.color !== piece.color
    );

    const prev = {
        pieceName,
        oldPosition: piece.current_position,
        capturedPiece: captured
            ? {
                  pieceKey: Object.keys(globalPiece).find(
                      k => globalPiece[k] === captured
                  ),
                  position: captured.current_position,
              }
            : null,
    };

    if (captured) captured.current_position = null;
    piece.current_position = targetSquare;

    return prev;
}

function undoSimulatedMove(prev) {
    if (!prev || !prev.pieceName) return;
    const piece = globalPiece[prev.pieceName];
    if (piece) piece.current_position = prev.oldPosition;

    if (prev.capturedPiece) {
        const cap = globalPiece[prev.capturedPiece.pieceKey];
        if (cap) cap.current_position = prev.capturedPiece.position;
    }
}

export function isCheckmate(currentTurn) {
    if (!isInCheck(currentTurn)) return false;
    const pieces = getAllPiecesOfColor(currentTurn);

    for (const piece of pieces) {
        const possibleMoves = getValidMoves(piece, currentTurn);

        if (!Array.isArray(possibleMoves)) {
            console.warn("Некорректный формат ходов:", piece, possibleMoves);
            continue;
        }

        for (const move of possibleMoves) {
            const prev = simulateMove(piece, move);
            const stillInCheck = isInCheck(currentTurn);
            undoSimulatedMove(prev);
            if (!stillInCheck) return false;
        }
    }

    return true;
}

function showCheckIfKing(piece, pieceId, keySquareMapper) {
    console.log("Вызван showCheckIfKing:", piece?.piece_name, pieceId);

    const color = piece.color;
    const enemyColor = color === "white" ? "black" : "white";
    const name = piece.piece_name;

    let attackSquares = [];

    if (name.includes("queen")) {
        attackSquares = giveQueenCaptureIds(pieceId, enemyColor);
    } else if (name.includes("rook")) {
        attackSquares = giveRookCaptureIds(pieceId, enemyColor);
    } else if (name.includes("bishop")) {
        attackSquares = giveBishopCaptureIds(pieceId, enemyColor);
    } else if (name.includes("knight")) {
        attackSquares = giveKnightCaptureIds(pieceId, enemyColor);
    } else if (name.includes("king")) {
        attackSquares = giveKingCaptureIds(pieceId, enemyColor);
    }

    const kingId = Object.keys(keySquareMapper).find(id => {
        const el = keySquareMapper[id];
        return (
            el.piece &&
            el.piece.piece_name ===
                `${color === "white" ? "black" : "white"}_king`
        );
    });

    if (kingId && attackSquares.includes(kingId)) {
        showCheckAlert();
        highlightKingSquare(kingId);
    }
}

function highlightKingSquare(id) {
    const el = document.getElementById(id);
    if (el) {
        el.classList.add("checkHighlight");
        setTimeout(() => el.classList.remove("checkHighlight"), 2000);
    }
}

function showCheckAlert() {
    const alert = document.createElement("div");
    alert.innerText = "Шах!";
    alert.className = "check-alert";

    Object.assign(alert.style, {
        position: "absolute",
        top: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "#ff4444",
        color: "white",
        padding: "10px 20px",
        borderRadius: "8px",
        fontSize: "18px",
        zIndex: "9999",
        boxShadow: "0 0 10px rgba(0,0,0,0.5)",
    });

    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 2000);
}

function showCheckmateAlert(winnerColor) {
    const alert = document.createElement("div");
    alert.innerText = `Мат! Победа: ${
        winnerColor === "white" ? "Белых" : "Чёрных"
    }!`;
    alert.className = "checkmate-alert";

    Object.assign(alert.style, {
        position: "absolute",
        top: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "#222",
        color: "#fff",
        padding: "12px 24px",
        borderRadius: "8px",
        fontSize: "20px",
        zIndex: "9999",
        boxShadow: "0 0 12px rgba(0,0,0,0.7)",
    });

    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 5000);
}

function disableAllInteraction() {
    document.querySelectorAll(".cell").forEach(cell => {
        cell.style.pointerEvents = "none";
    });
}

let whoInCheck = null;

export function checkGameEnd(currentTurn) {
    const isCheck = isInCheck(currentTurn);

    if (isCheck) {
        if (whoInCheck !== currentTurn) {
            const kingId = globalPiece[`${currentTurn}_king`]?.current_position;
            if (kingId) highlightKingSquare(kingId);
            showCheckAlert();
            whoInCheck = currentTurn;
        }

        if (isCheckmate(currentTurn)) {
            if (isCheckmate(currentTurn)) {
                console.warn("Шах и мат!");
                console.warn(
                    "Текущее состояние:",
                    JSON.stringify(globalPiece, null, 2)
                );
            }

            const winnerColor = currentTurn === "white" ? "black" : "white";
            showCheckmateAlert(winnerColor);
            disableAllInteraction();
        }
    } else {
        whoInCheck = null;
        document
            .querySelectorAll(".checkHighlight")
            .forEach(el => el.classList.remove("checkHighlight"));
    }
}

export {
    isInCheck,
    showCheckAlert,
    showCheckIfKing,
    showCheckmateAlert,
    disableAllInteraction,
    getValidMoves,
    simulateMove,
};
