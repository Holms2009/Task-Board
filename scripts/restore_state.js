'use strict'

if (localStorage.userSettings) {
    userSettings = JSON.parse(localStorage.userSettings);
    fontSizeHandler.value = parseInt(userSettings.cardsFontSize);
}

if (localStorage.savedCards.length !== 0) {
    let cardsToRestore = JSON.parse(localStorage.savedCards);
    for (let i of cardsToRestore) {
        restoreCard(i);
    }

}

function restoreCard(cardObj) {
    let oldCard = cardTemplate.cloneNode(true),
        cardHeader = oldCard.querySelector('.board-card__header'),
        cardList = oldCard.querySelector('.board-card__list'),
        cardDate = oldCard.querySelector('.board-card__date');

    savedCards.push(cardObj);
    oldCard.style.fontSize = userSettings.cardsFontSize;
    oldCard.id = cardObj.id;
    cardId = +cardObj.id + 1;
    cardHeader.textContent = cardObj.header;
    cardDate.textContent = cardObj.date;
    setTaskAdder(oldCard);

    cardObj.tasks.forEach((item, index) => {
        let taskToAdd = taskTemplate.cloneNode(true),
            taskToAddText = taskToAdd.querySelector('.board-card__task'),
            taskToAddMarker = taskToAdd.querySelector('.board-card__circle'),
            taskText = item;

        taskToAdd.taskId = cardObj.taskIds[index];
        taskToAddMarker.style.fill = cardObj.markers[index];
        taskToAddText.textContent = taskText;
        setTaskRemover(taskToAdd, oldCard);
        setMarkerColorToggler(oldCard, taskToAdd);
        setTaskEditor(oldCard, taskToAdd);
        cardList.appendChild(taskToAdd);
    });

    board.appendChild(oldCard);
    setMoover(oldCard);
    oldCard.style.left = cardObj.left;
    oldCard.style.top = cardObj.top;
}
