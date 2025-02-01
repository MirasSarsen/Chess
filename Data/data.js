export function Greet() {}

function Square(color, id, piece) {
    return { color, id, piece };
}

function SquareRow(rowId) {
    const squareRow = [];
    const alf = ["a", "b", "c", "d", "e", "f", "g", "h"];
    if (rowId % 2 == 0) {
        let initColor = "white";
        alf.forEach((element, index) => {
            console.log(index);
            //squareRow.push(Square("white", "e5", null));
        });
    } else {
        squareRow.push(Square("black", "e5", null));
    }

    return squareRow;
}

function initGame() {
    return [
        SquareRow(8),
        SquareRow(7),
        SquareRow(6),
        SquareRow(5),
        SquareRow(4),
        SquareRow(3),
        SquareRow(2),
        SquareRow(1),
    ];
}

export { initGame };
