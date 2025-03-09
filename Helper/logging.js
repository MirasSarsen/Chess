const orderList = document.querySelector("ol");

function logMoves(logMoves, inTurn) {
    console.log(orderList);

    if (inTurn === "white") {
        const list = document.createElement("li");
        list.innerHTML = `<span class="leftSide">${logMoves.to}</span>`;
        orderList.appendChild(list);
    } else {
        const allLiArray = orderList.querySelectorAll("li");
        const lastLi = allLiArray[allLiArray.length - 1];

        if (lastLi) {
            lastLi.innerHTML += ` - <span>${logMoves.to}</span>`;
        } else {
            // Если нет предыдущего хода, создаем новую строку
            const list = document.createElement("li");
            list.innerHTML = `<span class="leftSide">??</span> - <span>${logMoves.to}</span>`;
            orderList.appendChild(list);
        }
    }

    // Автоскролл вниз
    orderList.scrollTop = orderList.scrollHeight;
}

export default logMoves;
