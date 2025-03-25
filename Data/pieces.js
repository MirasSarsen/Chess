//сторона белых
function whitePawn(current_position) {
    return {
        current_position,
        img: "images/pieces/white/pawn.png",
        piece_name: "white_pawn",
    };
}

function whiteRook(current_position) {
    return {
        move: false,
        current_position,
        img: "images/pieces/white/rook.png",
        piece_name: "white_rook",
    };
}

function whiteKnight(current_position) {
    return {
        current_position,
        img: "images/pieces/white/knight.png",
        piece_name: "white_knight",
    };
}

function whiteBishop(current_position) {
    return {
        current_position,
        img: "images/pieces/white/bishop.png",
        piece_name: "white_bishop",
    };
}

function whiteQueen(current_position) {
    return {
        current_position,
        img: "images/pieces/white/queen.png",
        piece_name: "white_queen",
    };
}

function whiteKing(current_position) {
    return {
        move: false,
        current_position,
        img: "images/pieces/white/king.png",
        piece_name: "white_king",
    };
}

//сторона черных
function blackPawn(current_position) {
    return {
        current_position,
        img: "images/pieces/black/pawn.png",
        piece_name: "black_pawn",
    };
}

function blackRook(current_position) {
    return {
        move: false,
        current_position,
        img: "images/pieces/black/rook.png",
        piece_name: "black_rook",
    };
}

function blackKnight(current_position) {
    return {
        current_position,
        img: "images/pieces/black/knight.png",
        piece_name: "black_knight",
    };
}

function blackBishop(current_position) {
    return {
        current_position,
        img: "images/pieces/black/bishop.png",
        piece_name: "black_bishop",
    };
}

function blackQueen(current_position) {
    return {
        current_position,
        img: "images/pieces/black/queen.png",
        piece_name: "black_queen",
    };
}

function blackKing(current_position) {
    return {
        move: false,
        current_position,
        img: "images/pieces/black/king.png",
        piece_name: "black_king",
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
