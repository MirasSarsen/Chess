import {
    giveQueenCaptureIds,
    giveRookCaptureIds,
    giveBishopCaptureIds,
    giveKnightCaptureIds,
    giveKingCaptureIds,
} from "../Helper/commonHelper.js";

// Белые фигуры
function whitePawn(current_position) {
    return {
        current_position,
        img: "images/pieces/white/pawn.png",
        piece_name: "white_pawn",
        color: "white",
        type: "pawn",
    };
}

function whiteRook(current_position) {
    return {
        type: "rook",
        move: false,
        current_position,
        img: "images/pieces/white/rook.png",
        piece_name: "white_rook",
        color: "white",
        getAttackedSquares() {
            return giveRookCaptureIds(this.current_position, this.color);
        },
    };
}

function whiteKnight(current_position) {
    return {
        type: "knight",
        current_position,
        img: "images/pieces/white/knight.png",
        piece_name: "white_knight",
        color: "white",
        getAttackedSquares() {
            return giveKnightCaptureIds(this.current_position, this.color);
        },
    };
}

function whiteBishop(current_position) {
    return {
        type: "bishop",
        current_position,
        img: "images/pieces/white/bishop.png",
        piece_name: "white_bishop",
        color: "white",
        getAttackedSquares() {
            return giveBishopCaptureIds(this.current_position, this.color);
        },
    };
}

function whiteQueen(current_position) {
    return {
        type: "queen",
        current_position,
        img: "images/pieces/white/queen.png",
        piece_name: "white_queen",
        color: "white",
        getAttackedSquares() {
            return giveQueenCaptureIds(this.current_position, this.color);
        },
    };
}

function whiteKing(current_position) {
    return {
        type: "king",
        move: false,
        current_position,
        img: "images/pieces/white/king.png",
        piece_name: "white_king",
        color: "white",
        getAttackedSquares() {
            return giveKingCaptureIds(this.current_position, this.color);
        },
    };
}

// Чёрные фигуры
function blackPawn(current_position) {
    return {
        current_position,
        img: "images/pieces/black/pawn.png",
        piece_name: "black_pawn",
        color: "black",
        type: "pawn",
    };
}

function blackRook(current_position) {
    return {
        type: "rook",
        move: false,
        current_position,
        img: "images/pieces/black/rook.png",
        piece_name: "black_rook",
        color: "black",
        getAttackedSquares() {
            return giveRookCaptureIds(this.current_position, this.color);
        },
    };
}

function blackKnight(current_position) {
    return {
        type: "knight",
        current_position,
        img: "images/pieces/black/knight.png",
        piece_name: "black_knight",
        color: "black",
        getAttackedSquares() {
            return giveKnightCaptureIds(this.current_position, this.color);
        },
    };
}

function blackBishop(current_position) {
    return {
        type: "bishop",
        current_position,
        img: "images/pieces/black/bishop.png",
        piece_name: "black_bishop",
        color: "black",
        getAttackedSquares() {
            return giveBishopCaptureIds(this.current_position, this.color);
        },
    };
}

function blackQueen(current_position) {
    return {
        type: "queen",
        current_position,
        img: "images/pieces/black/queen.png",
        piece_name: "black_queen",
        color: "black",
        getAttackedSquares() {
            return giveQueenCaptureIds(this.current_position, this.color);
        },
    };
}

function blackKing(current_position) {
    return {
        type: "king",
        move: false,
        current_position,
        img: "images/pieces/black/king.png",
        piece_name: "black_king",
        color: "black",
        getAttackedSquares() {
            return giveKingCaptureIds(this.current_position, this.color);
        },
    };
}

export {
    whitePawn,
    whiteBishop,
    whiteKnight,
    whiteRook,
    whiteKing,
    whiteQueen,
    blackPawn,
    blackBishop,
    blackKnight,
    blackRook,
    blackKing,
    blackQueen,
};
