'use strict'

clearBoardButton.addEventListener('click', function () {
    let cards = board.querySelectorAll('.board-card');
    for (let i of cards) {
        i.style.transform = "scale(0)";
        setTimeout(() => i.remove(), 300);
    }
    localStorage.savedCards = '';
    savedCards = [];
    cardId = 1;
})

addCardButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    showForm('new card');
})

function createNewCard(resolve) {
    let newCard = cardTemplate.cloneNode(true),
        cardDate = newCard.querySelector('.board-card__date'),
        cardHeader = newCard.querySelector('.board-card__header');
    
    if (userSettings.cardsFontSize !== '') newCard.style.fontSize = userSettings.cardsFontSize;
    newCard.tasksIdsCounter = 1;    
    cardHeader.textContent = formCardHeaderInput.value;
    formCardHeaderInput.value = '';
    cardDate.textContent = `Дата: ${createDate()}`;
    setCardId(newCard);     
    savedCards.push(new Card(newCard));
    setTaskAdder(newCard);  
    createTask(newCard);
    board.appendChild(newCard);
    setMoover(newCard);

    newCard.style.left = '40%';
    newCard.style.top = '-300px';
    setTimeout(() => cardFall(newCard), 100);
};

function createTask(card) {
    let taskList = card.querySelector('.board-card__list'),
        task = taskTemplate.cloneNode(true),
        taskText = task.querySelector('.board-card__task');

    task.taskId = card.tasksIdsCounter++;
    taskText.textContent = textField.value;
    setTaskRemover(task, card);
    setMarkerColorToggler(card, task);
    setTaskEditor(card, task);
    saveTask(card, task);

    taskList.appendChild(task);
    textField.value = '';
}

function createDate() {
    let date = new Date(),
        day = date.getDate(),
        month = date.getMonth() + 1,
        year = date.getFullYear();

    if (month < 10) month = `0${month}`;
    if (day < 10) day = `0${day}`;

    return  `${day}.${month}.${year}`;
}

function setCardId(card) {
    card.id = cardId;
    if (cardId < 1000) {
        cardId++;
    } else {
        cardId = 1;
    }
}

function saveTask(card, task) {
    let marker = task.querySelector('.board-card__circle').style.fill,
        text = task.querySelector('.board-card__task'),
        destinationCard = savedCards.find(item => item.id == card.id);

    destinationCard.tasks.push(text.textContent);
    destinationCard.markers.push(marker);
    destinationCard.taskIds.push(task.taskId);
    localStorage.savedCards = JSON.stringify(savedCards);
}

function setFixedFocus(element) {
    element.addEventListener('focusout', () => element.focus());
}

function cardFall(card) {
    card.style.transition = 'all 500ms cubic-bezier(0.500, 0.250, 0.195, 1.650)'
    card.style.top = '300px';
    setTimeout(() => {
        card.style.transition = 'transform 0.3s';
        savePosition(card, card.style.left, card.style.top);
    }, 1000);
}