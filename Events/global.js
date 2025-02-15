import { ROOT_DIV } from "../Helper/constants.js";
import { globalState } from "../index.js";
import { clearHighlight, renderHighlight } from "../Render/main.js";

let highlight_state = false;

function whitePawnClick( {piece} ) {
    const flatArray = globalState.flat();
    const current_pos = piece.current_position;
    //исходное положение пешки
    if(current_pos[1] == '2') {
        let hightlightSquareIds = [
            `${current_pos[0]}${Number(current_pos[1]) + 1}`,
            `${current_pos[0]}${Number(current_pos[1]) + 2}`
        ];

        clearHighlight();

        hightlightSquareIds.forEach(highlight => {
            globalState.forEach(row => {
                row.forEach(element => {
                    if(element.id == highlight){
                        element.highlight(true);
                    }
                    
                });
            });

         //   if(highlight_state) clearHighlight()
         //   renderHighlight(hightlight);
         //   highlight_state = true;
        });
    }
}

function GlobalEvent() {
    ROOT_DIV.addEventListener("click", function (event) {
        if (event.target.localName === "img") {
            const clickId = event.target.parentNode.id;
            const flatArray = globalState.flat();
            const square = flatArray.find((el) => el.id == clickId);
            if (square.piece.piece_name == "white_pawn") {
                whitePawnClick(square);
            }
        }
    });
}

export { GlobalEvent };
