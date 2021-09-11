'use strict'

function setTaskAdder(card) {
    let adderButton = card.querySelector('.board-card__add-task-button');

    adderButton.addEventListener('click', function () {
        showForm('new task', card);
    });
}

function setTaskRemover(task, card) {
    let removeButton = task.querySelector('.board-card__task-remover');

    removeButton.addEventListener('click', function () {
        let destinationCard = savedCards.find(item => item.id == card.id);
        let taskIndex = destinationCard.taskIds.indexOf(task.taskId);

        destinationCard.tasks.splice(taskIndex, 1);
        destinationCard.markers.splice(taskIndex, 1);
        destinationCard.taskIds.splice(taskIndex, 1);
        localStorage.savedCards = JSON.stringify(savedCards);
        task.remove();

        if (!card.querySelector('.board-card__item')) {
            for (let i of savedCards) {
                if (i.id == card.id) {
                    savedCards.splice(savedCards.indexOf(i), 1);
                    localStorage.savedCards = JSON.stringify(savedCards);
                }
            }

            card.style.transform = "scale(0)";
            setTimeout(() => card.remove(), 300);
        }
    });
}

function setMarkerColorToggler(card, task) {
    let colors = ['limegreen', 'orange', 'red'],
        marker = task.querySelector('.board-card__circle'),
        destinationCard = savedCards.find(item => item.id == card.id);

    marker.addEventListener('click', function () {
        if (colors.indexOf(`${marker.style.fill}`) === 2) {
            marker.style.fill = colors[0];
        } else {
            marker.style.fill = colors[colors.indexOf(marker.style.fill) + 1];
        }
        let taskIndex = destinationCard.taskIds.indexOf(task.taskId);
        destinationCard.markers[taskIndex] = marker.style.fill;
        localStorage.savedCards = JSON.stringify(savedCards);
    })
}

function setTaskEditor(card, task) {
    task.addEventListener('dblclick', function () {
        let taskText = task.querySelector('.board-card__task');
        let editor = document.createElement('textarea');

        editor.classList.add('board-card__task-editor');
        editor.value = taskText.textContent;
        editor.rows = 3;
        task.style.marginBottom = '40px';
        setConfirmEvent(card, task, editor);
        setFixedFocus(editor);

        task.appendChild(editor);
        editor.focus();
    })
}

function setConfirmEvent(card, task, editor) {
    let taskText = task.querySelector('.board-card__task');
    let destinationCard = savedCards.find(item => item.id == card.id);

    editor.addEventListener('keydown', function (evt) {
        if (evt.keyCode === 13) {
            evt.preventDefault();
            taskText.textContent = editor.value;
            destinationCard.tasks[destinationCard.taskIds.indexOf(task.taskId)] = editor.value;
            task.style.marginBottom = 0;
            editor.remove();
            localStorage.savedCards = JSON.stringify(savedCards);
        }
    })
}