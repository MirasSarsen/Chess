// Белые фигуры
function whitePawn(current_position) {
    return {
        current_position,
        img: "images/pieces/white/pawn.png",
        piece_name: "white_pawn",
        color: "white",
    };
}

function whiteRook(current_position) {
    return {
        move: false,
        current_position,
        img: "images/pieces/white/rook.png",
        piece_name: "white_rook",
        color: "white",
    };
}

function whiteKnight(current_position) {
    return {
        current_position,
        img: "images/pieces/white/knight.png",
        piece_name: "white_knight",
        color: "white",
    };
}

function whiteBishop(current_position) {
    return {
        current_position,
        img: "images/pieces/white/bishop.png",
        piece_name: "white_bishop",
        color: "white",
    };
}

function whiteQueen(current_position) {
    return {
        current_position,
        img: "images/pieces/white/queen.png",
        piece_name: "white_queen",
        color: "white",
    };
}

function whiteKing(current_position) {
    return {
        move: false,
        current_position,
        img: "images/pieces/white/king.png",
        piece_name: "white_king",
        color: "white",
    };
}

// Чёрные фигуры
function blackPawn(current_position) {
    return {
        current_position,
        img: "images/pieces/black/pawn.png",
        piece_name: "black_pawn",
        color: "black",
    };
}

function blackRook(current_position) {
    return {
        move: false,
        current_position,
        img: "images/pieces/black/rook.png",
        piece_name: "black_rook",
        color: "black",
    };
}

function blackKnight(current_position) {
    return {
        current_position,
        img: "images/pieces/black/knight.png",
        piece_name: "black_knight",
        color: "black",
    };
}

function blackBishop(current_position) {
    return {
        current_position,
        img: "images/pieces/black/bishop.png",
        piece_name: "black_bishop",
        color: "black",
    };
}

function blackQueen(current_position) {
    return {
        current_position,
        img: "images/pieces/black/queen.png",
        piece_name: "black_queen",
        color: "black",
    };
}

function blackKing(current_position) {
    return {
        move: false,
        current_position,
        img: "images/pieces/black/king.png",
        piece_name: "black_king",
        color: "black",
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
