import { globalPiece } from "../Render/main.js";
import {
    giveKnightCaptureIds,
    giveKingCaptureIds,
    giveBishopCaptureIds,
    giveRookCaptureIds,
    giveQueenCaptureIds,
    checkWeatherPieceExistsOrNot,
} from "./commonHelper.js";
import { keySquareMapper } from "../index.js";

function isInCheck(currentTurn) {
    const isBlack = currentTurn === "black";
    const ownKingPos = isBlack
        ? globalPiece.black_king?.current_position
        : globalPiece.white_king?.current_position;

    if (!ownKingPos) {
        console.warn("Собственный король не найден на доске.");
        return false;
    }

    const enemyPrefix = isBlack ? "white" : "black";

    const attackers = [
        globalPiece[`${enemyPrefix}_knight_1`],
        globalPiece[`${enemyPrefix}_knight_2`],
        globalPiece[`${enemyPrefix}_king`],
        globalPiece[`${enemyPrefix}_bishop_1`],
        globalPiece[`${enemyPrefix}_bishop_2`],
        globalPiece[`${enemyPrefix}_rook_1`],
        globalPiece[`${enemyPrefix}_rook_2`],
        globalPiece[`${enemyPrefix}_queen`],
    ];

    const moveFuncs = {
        knight: giveKnightCaptureIds,
        king: giveKingCaptureIds,
        bishop: giveBishopCaptureIds,
        rook: giveRookCaptureIds,
        queen: giveQueenCaptureIds,
    };

    const attackSquares = attackers.flatMap(piece => {
        if (!piece || !piece.current_position) return [];
        const type =
            piece.type ||
            (typeof piece.name === "string" ? piece.name.split("_")[1] : null);
        return moveFuncs[type]?.(piece.current_position, enemyPrefix) || [];
    });

    return attackSquares.includes(ownKingPos);
}

function getAllPiecesOfColor(color) {
    return Object.values(globalPiece).filter(
        p => p.color === color && p.current_position
    );
}

function getValidMoves(piece, currentTurn) {
    const pos = piece.current_position;
    if (!pos) return [];

    switch (piece.type) {
        case "knight":
            return giveKnightCaptureIds(pos, currentTurn);
        case "king":
            return giveKingCaptureIds(pos, currentTurn);
        case "bishop":
            return giveBishopCaptureIds(pos, currentTurn);
        case "rook":
            return giveRookCaptureIds(pos, currentTurn);
        case "queen":
            return giveQueenCaptureIds(pos, currentTurn);
        case "pawn":
            const direction = currentTurn === "white" ? -1 : 1;
            const x = parseInt(pos[1], 10);
            const y = pos[0];
            const front1 = `${y}${x + direction}`;
            const front2 = `${y}${x + direction * 2}`;
            const captureLeft = `${String.fromCharCode(y.charCodeAt(0) - 1)}${
                x + direction
            }`;
            const captureRight = `${String.fromCharCode(y.charCodeAt(0) + 1)}${
                x + direction
            }`;

            const moves = [];

            // Ходы вперед (если клетка свободна)
            if (!checkWeatherPieceExistsOrNot(front1)) moves.push(front1);
            if (
                ((currentTurn === "white" && x === 2) ||
                    (currentTurn === "black" && x === 7)) &&
                !checkWeatherPieceExistsOrNot(front1) &&
                !checkWeatherPieceExistsOrNot(front2)
            ) {
                moves.push(front2);
            }

            // Взятия по диагонали
            [captureLeft, captureRight].forEach(square => {
                if (checkWeatherPieceExistsOrNot(square, currentTurn)) {
                    moves.push(square);
                }
            });

            return moves;
        default:
            return [];
    }
}

function simulateMove(piece, targetSquare) {
    const captured = Object.values(globalPiece).find(
        p => p.current_position === targetSquare && p.color !== piece.color
    );

    const prev = {
        pieceName: piece.name,
        oldPosition: piece.current_position,
        capturedPiece: captured
            ? {
                  name: captured.name,
                  position: captured.current_position,
              }
            : null,
    };

    if (captured) captured.current_position = null;
    piece.current_position = targetSquare;

    return prev;
}

function undoSimulatedMove(prev) {
    if (!prev) return;
    const piece = globalPiece[prev.pieceName];
    piece.current_position = prev.oldPosition;

    if (prev.capturedPiece) {
        globalPiece[prev.capturedPiece.name].current_position =
            prev.capturedPiece.position;
    }
}

export function isCheckmate(currentTurn) {
    if (!isInCheck(currentTurn)) return false;
    const pieces = getAllPiecesOfColor(currentTurn);

    for (const piece of pieces) {
        const possibleMoves = getValidMoves(piece, currentTurn);
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
    const color = piece.color;
    const name = piece.piece_name;

    let attackSquares = [];

    if (name.includes("queen")) {
        attackSquares = giveQueenCaptureIds(pieceId, color);
    } else if (name.includes("rook")) {
        attackSquares = giveRookCaptureIds(pieceId, color);
    } else if (name.includes("bishop")) {
        attackSquares = giveBishopCaptureIds(pieceId, color);
    } else if (name.includes("knight")) {
        attackSquares = giveKnightCaptureIds(pieceId, color);
    } else if (name.includes("king")) {
        attackSquares = giveKingCaptureIds(pieceId, color);
    }

    const kingId = Object.keys(keySquareMapper).find(id => {
        const el = keySquareMapper[id];
        return (
            el.piece &&
            el.piece.piece_name ===
                `${color === "white" ? "black" : "white"}-king`
        );
    });

    if (kingId && attackSquares.includes(kingId)) {
        showCheckAlert(); // Показать "Шах!"
    }
}

function showCheckAlert() {
    const alert = document.createElement("div");
    alert.innerText = "Шах!";
    alert.className = "check-alert";

    // Пример стилей
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

    setTimeout(() => alert.remove(), 2000); // исчезает через 2 секунды
}

export { isInCheck, showCheckAlert, showCheckIfKing };
