class ModalCreator {
    constructor(body) {
        if (!body) {
            throw new Error("Пожалуйства выберите фигуру");
        }

        this.open = false;
        this.body = body;
    }

    show() {
        this.open = true;
        document.body.appendChild(this.body);
        document.getElementById("root").classList.add("blur");
    }
}

function pawnPromotion(color) {
    const rook = document.createElement("img");
    rook.src = `../images/pieces/${color}/rook.png`;

    const knight = document.createElement("img");
    knight.src = `../images/pieces/${color}/knight.png`;

    const bishop = document.createElement("img");
    bishop.src = `../images/pieces/${color}/bishop.png`;

    const queen = document.createElement("img");
    queen.src = `../images/pieces/${color}/queen.png`;

    const imageContainer = document.createElement("div");
    imageContainer.appendChild(rook);
    imageContainer.appendChild(knight);
    imageContainer.appendChild(bishop);
    imageContainer.appendChild(queen);

    const msg = document.createElement("p");
    msg.textContent = "Ваша пешка превращена";

    const finalContainer = document.createElement("div");
    finalContainer.appendChild(msg);
    finalContainer.appendChild(imageContainer);

    finalContainer.classList.add("modal");

    const modal = new ModalCreator(finalContainer);
    modal.show();
}

export default pawnPromotion;
