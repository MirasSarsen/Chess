//сторона черных
function whitePawn(current_position) {
    return {
        current_position,
        img: "images/pieces/white/pawn.png",
    };
}

function whiteRook(current_position) {
    return {
        current_position,
        img: "images/pieces/white/rook.png",
    };
}

function whiteKnight(current_position) {
    return {
        current_position,
        img: "images/pieces/white/knight.png",
    };
}

function whiteBishop(current_position) {
    return {
        current_position,
        img: "images/pieces/white/bishop.png",
    };
}

function whiteQueen(current_position) {
    return {
        current_position,
        img: "images/pieces/white/queen.png",
    };
}

function whiteKing(current_position) {
    return {
        current_position,
        img: "images/pieces/white/king.png",
    };
}

//сторона белых
function blackPawn(current_position) {
    return {
        current_position,
        img: "images/pieces/black/pawn.png",
    };
}

function blackRook(current_position) {
    return {
        current_position,
        img: "images/pieces/black/rook.png",
    };
}

function blackKnight(current_position) {
    return {
        current_position,
        img: "images/pieces/black/knight.png",
    };
}

function blackBishop(current_position) {
    return {
        current_position,
        img: "images/pieces/black/bishop.png",
    };
}

function blackQueen(current_position) {
    return {
        current_position,
        img: "images/pieces/black/queen.png",
    };
}

function blackKing(current_position) {
    return {
        current_position,
        img: "images/pieces/black/king.png",
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
