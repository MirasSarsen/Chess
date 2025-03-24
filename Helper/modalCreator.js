import {
    blackBishop,
    blackKnight,
    blackRook,
    blackQueen,
    whiteBishop,
    whiteKnight,
    whiteRook,
    whiteQueen,
} from "../Data/pieces.js";

class ModalCreator {
    constructor(body) {
        if (!body) {
            throw new Error("Пожалуйста выберите фигуру");
        }

        this.open = false;
        this.body = body;
    }

    show() {
        this.open = true;
        document.body.appendChild(this.body);
        document.getElementById("root").classList.add("blur");
    }

    hide() {
        this.open = false;
        document.body.removeChild(this.body);
        document.getElementById("root").classList.remove("blur");
    }
}

function pawnPromotion(color, callback, id) {
    const rook = document.createElement("img");
    rook.onclick = rookCallback;
    rook.src = `../images/pieces/${color}/rook.png`;

    const knight = document.createElement("img");
    knight.onclick = knightCallback;
    knight.src = `../images/pieces/${color}/knight.png`;

    const bishop = document.createElement("img");
    bishop.onclick = bishopCallback;
    bishop.src = `../images/pieces/${color}/bishop.png`;

    const queen = document.createElement("img");
    queen.onclick = queenCallback;
    queen.src = `../images/pieces/${color}/queen.png`;

    const imageContainer = document.createElement("div");
    imageContainer.classList.add("promotion-container");
    imageContainer.appendChild(rook);
    imageContainer.appendChild(knight);
    imageContainer.appendChild(bishop);
    imageContainer.appendChild(queen);

    const msg = document.createElement("p");
    msg.textContent = "Ваша пешка превратиться в:";

    const finalContainer = document.createElement("div");
    finalContainer.appendChild(msg);
    finalContainer.appendChild(imageContainer);
    finalContainer.classList.add("modal");

    const modal = new ModalCreator(finalContainer);
    modal.show();

    function rookCallback() {
        if (color == "white") {
            callback(whiteRook, id);
        } else {
            callback(blackRook, id);
        }
        modal.hide();
    }

    function knightCallback() {
        if (color == "white") {
            callback(whiteKnight, id);
        } else {
            callback(blackKnight, id);
        }
        modal.hide();
    }

    function bishopCallback() {
        if (color == "white") {
            callback(whiteBishop, id);
        } else {
            callback(blackBishop, id);
        }
        modal.hide();
    }

    function queenCallback() {
        if (color == "white") {
            callback(whiteQueen, id);
        } else {
            callback(blackQueen, id);
        }
        modal.hide();
    }
}

export default pawnPromotion;
