import { globalPiece } from "../Render/main.js";
import {
    giveKnightCaptureIds,
    giveKingCaptureIds,
    giveBishopCaptureIds,
    giveRookCaptureIds,
    giveQueenCaptureIds,
    checkWeatherPieceExistsOrNot,
} from "./commonHelper.js";

function isInCheck(inTurn) {
    const isBlack = inTurn === "black";
    const opponentKingPos = isBlack
        ? globalPiece.white_king?.current_position
        : globalPiece.black_king?.current_position;

    if (!opponentKingPos) {
        console.warn("Король противника не найден на доске.");
        return false;
    }

    const prefix = isBlack ? "black" : "white";

    const attackers = [
        globalPiece[`${prefix}_knight_1`],
        globalPiece[`${prefix}_knight_2`],
        globalPiece[`${prefix}_king`],
        globalPiece[`${prefix}_bishop_1`],
        globalPiece[`${prefix}_bishop_2`],
        globalPiece[`${prefix}_rook_1`],
        globalPiece[`${prefix}_rook_2`],
        globalPiece[`${prefix}_queen`],
    ];

    const moveFuncs = {
        knight: giveKnightCaptureIds,
        king: giveKingCaptureIds,
        bishop: giveBishopCaptureIds,
        rook: giveRookCaptureIds,
        queen: giveQueenCaptureIds,
    };

    let attackSquares = attackers.flatMap(piece => {
        if (!piece || !piece.current_position) return [];
        const type =
            piece.type ||
            (typeof piece.name === "string" ? piece.name.split("_")[1] : null);
        return moveFuncs[type]?.(piece.current_position, inTurn) || [];
    });

    return attackSquares.includes(opponentKingPos);
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

export default isInCheck;
