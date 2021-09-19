'use strict'

import { updateDoc, setDoc, getDocs } from "firebase/firestore/lite";
import { activeUserBase, getData, findUser, database } from './login'

let page = document.querySelector('body'),
  board = page.querySelector('.board'),
  clearBoardButton = page.querySelector('.clear-board'),
  addCardButton = page.querySelector('.add-card'),
  cardTemplate = board.querySelector('#card-template').content.querySelector('.board-card'),
  taskTemplate = board.querySelector('#task-template').content.querySelector('.board-card__item'),
  cardId = 1,
  form = page.querySelector('.card-contents'),
  textField = form.querySelector('.card-contents__text'),
  submitButton = form.querySelector('.card-contents__submit-button'),
  formHeader = form.querySelector('.card-contents__header-1'),
  formCardHeaderInput = form.querySelector('.card-contents__card-header'),
  blocker,
  savedCards = [];

let blockerObj = {
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  zIndex: 50,
}

class Card {
  constructor(card) {
    this.id = card.id;
    this.header = card.querySelector('.board-card__header').textContent;
    this.date = card.querySelector('.board-card__date').textContent;
    this.tasks = [];
    this.taskIds = [];
    this.markers = [];
    this.left = '';
    this.top = '';
  }
}

class DefaultSettings {
  constructor() {
    this.cardsFontSize = '14px';
  }
}

class UserSettings extends DefaultSettings {
  constructor() {
    super();
  }
}

let defaultSettings = new DefaultSettings();
let userSettings = new UserSettings();

class NoTextError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NoTextError';
  }
}

window.addEventListener('resize', () => {
  let cards = document.querySelectorAll('.board-card');
  if (cards.length !== 0) {
    for (let i of cards) {
      checkBorders(i);
    }
  } else {
    return;
  }
});

window.addEventListener('load', () => {
  let cards = document.querySelectorAll('.board-card');
  if (cards.length !== 0) {
    for (let i of cards) {
      checkBorders(i);
    }
  } else {
    return;
  }
});

setInterval(() => {
  let clock = board.querySelector('.board__clock'),
    date = new Date(),
    hours = date.getHours(),
    minutes = date.getMinutes(),
    seconds = date.getSeconds();

  if (hours < 10) hours = `0${hours}`;
  if (minutes < 10) minutes = `0${minutes}`;
  if (seconds < 10) seconds = `0${seconds}`;

  clock.innerHTML = `${hours}:${minutes}:${seconds}`;
}, 1000);

//Main______________

clearBoardButton.addEventListener('click', async function () {
  let cards = board.querySelectorAll('.board-card');
  for (let i of cards) {
    i.style.transform = "scale(0)";
    setTimeout(() => i.remove(), 300);
  }
  localStorage.savedCards = '';
  savedCards = [];
  await updateDoc(activeUserBase, {
    savedCards: JSON.stringify(savedCards)
  })
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

  return `${day}.${month}.${year}`;
}

function setCardId(card) {
  card.id = cardId;
  if (cardId < 1000) {
    cardId++;
  } else {
    cardId = 1;
  }
}

async function saveTask(card, task) {
  let marker = task.querySelector('.board-card__circle').style.fill,
    text = task.querySelector('.board-card__task'),
    destinationCard = savedCards.find(item => item.id == card.id);

  destinationCard.tasks.push(text.textContent);
  destinationCard.markers.push(marker);
  destinationCard.taskIds.push(task.taskId);
  localStorage.savedCards = JSON.stringify(savedCards);
  await updateDoc(activeUserBase, {
    savedCards: JSON.stringify(savedCards)
  })
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

//Buttons setup___________

function setTaskAdder(card) {
  let adderButton = card.querySelector('.board-card__add-task-button');

  adderButton.addEventListener('click', function () {
    showForm('new task', card);
  });
}

async function setTaskRemover(task, card) {
  let removeButton = task.querySelector('.board-card__task-remover');

  removeButton.addEventListener('click', async function () {
    let destinationCard = savedCards.find(item => item.id == card.id);
    let taskIndex = destinationCard.taskIds.indexOf(task.taskId);

    destinationCard.tasks.splice(taskIndex, 1);
    destinationCard.markers.splice(taskIndex, 1);
    destinationCard.taskIds.splice(taskIndex, 1);
    localStorage.savedCards = JSON.stringify(savedCards);
    await updateDoc(activeUserBase, {
      savedCards: JSON.stringify(savedCards)
    })
    task.remove();

    if (!card.querySelector('.board-card__item')) {
      for (let i of savedCards) {
        if (i.id == card.id) {
          savedCards.splice(savedCards.indexOf(i), 1);
          localStorage.savedCards = JSON.stringify(savedCards);
          await updateDoc(activeUserBase, {
            savedCards: JSON.stringify(savedCards)
          })
        }
      }

      card.style.transform = "scale(0)";
      setTimeout(() => card.remove(), 300);
    }
  });
}

async function setMarkerColorToggler(card, task) {
  let colors = ['limegreen', 'orange', 'red'],
    marker = task.querySelector('.board-card__circle'),
    destinationCard = savedCards.find(item => item.id == card.id);

  marker.addEventListener('click', async function () {
    if (colors.indexOf(`${marker.style.fill}`) === 2) {
      marker.style.fill = colors[0];
    } else {
      marker.style.fill = colors[colors.indexOf(marker.style.fill) + 1];
    }
    let taskIndex = destinationCard.taskIds.indexOf(task.taskId);
    destinationCard.markers[taskIndex] = marker.style.fill;
    localStorage.savedCards = JSON.stringify(savedCards);
    await updateDoc(activeUserBase, {
      savedCards: JSON.stringify(savedCards)
    })
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

async function setConfirmEvent(card, task, editor) {
  let taskText = task.querySelector('.board-card__task');
  let destinationCard = savedCards.find(item => item.id == card.id);

  editor.addEventListener('keydown', async function (evt) {
    if (evt.keyCode === 13) {
      evt.preventDefault();
      taskText.textContent = editor.value;
      destinationCard.tasks[destinationCard.taskIds.indexOf(task.taskId)] = editor.value;
      task.style.marginBottom = 0;
      editor.remove();
      localStorage.savedCards = JSON.stringify(savedCards);
      await updateDoc(activeUserBase, {
        savedCards: JSON.stringify(savedCards)
      })
    }
  })
}

//Cards movement_________

function setMoover(card) {

  card.addEventListener('mousedown', evt => {
    if (evt.target.classList.contains('board-card__task-editor')) {
      return;
    } else {
      evt.preventDefault();
      let shiftX = evt.clientX - card.offsetLeft;
      let shiftY = evt.clientY - card.offsetTop;

      card.style.zIndex = 100;
      moveTo(evt.clientX, evt.clientY);
      document.addEventListener('mousemove', onMouseMove);

      function moveTo(xPos, yPos) {
        card.style.left = xPos - shiftX + 'px';
        card.style.top = yPos - shiftY + 'px';
      }

      function onMouseMove(evt) {
        moveTo(evt.clientX, evt.clientY);
      }

      function onMouseUp() {
        checkBorders(card);
        savePosition(card, card.style.left, card.style.top);
        document.removeEventListener('mousemove', onMouseMove);
        card.style.zIndex = 0;
        document.removeEventListener('mousemove', onMouseUp);
      }

      document.addEventListener('mouseup', onMouseUp);
    }
  });
}

async function savePosition(card, left, top) {
  let destinationCard = savedCards.find(item => item.id == card.id);
  destinationCard.left = left;
  destinationCard.top = top;
  localStorage.savedCards = JSON.stringify(savedCards);
  await updateDoc(activeUserBase, {
    savedCards: JSON.stringify(savedCards)
  })
}

function checkBorders(card) {
  let winW = window.innerWidth,
    winH = window.innerHeight,
    cardW = card.offsetWidth,
    cardH = card.offsetHeight;

  if (parseInt(card.style.left) < 0) card.style.left = '10px';
  if (parseInt(card.style.top) < 0) card.style.top = '10px';
  if (parseInt(card.style.left) + cardW > winW) card.style.left = `${winW - cardW - 10}px`;
  if (parseInt(card.style.top) + cardH > winH - 74) card.style.top = `${winH - cardH - 74}px`;
}

//Settings menu__________________

let settingsMenu = board.querySelector('.settings-menu');
let menuToggler = settingsMenu.querySelector('.settings-menu__button');
let togglerImage = menuToggler.querySelector('.settings-menu__button-image');
let fontSizeHandler = settingsMenu.querySelector('.settings-menu__font-size-setting');

menuToggler.addEventListener('click', function (evt) {
  evt.preventDefault();
  if (settingsMenu.style.transform === 'translateY(-100%)') {
    settingsMenu.style.transform = 'translateY(0)';
    togglerImage.style.transform = 'rotate(180deg)';
  } else {
    settingsMenu.style.transform = 'translateY(-100%)';
    togglerImage.style.transform = 'rotate(0)';
  }
});

fontSizeHandler.addEventListener('input', async function () {
  let cards = board.querySelectorAll('.board-card');
  for (let card of cards) {
    card.style.fontSize = fontSizeHandler.value + 'px';
  }
  userSettings.cardsFontSize = fontSizeHandler.value + 'px';
  localStorage.userSettings = JSON.stringify(userSettings);
  await updateDoc(activeUserBase, {
    savedCards: JSON.stringify(savedCards)
  })
})

//State restore_________________________

if (localStorage.userSettings) {
  userSettings = JSON.parse(localStorage.userSettings);
  fontSizeHandler.value = parseInt(userSettings.cardsFontSize);
}

if (sessionStorage.loginState === 'true') {
  let cardsToRestore;
  let req = findActiveUser().then(function (res) {
    cardsToRestore = JSON.parse(res);
    for (let i of cardsToRestore) {
      restoreCard(i);
    }
  });
}

async function findActiveUser() {
  let users = await getData(database);
  let user = findUser(users, sessionStorage.user);
  let result = user.savedCards;
  return result;
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

//Forms_________________

export function showForm(operationId, card) {
  form.classList.remove('hidden');

  if (operationId === 'new card') {
    formHeader.classList.remove('hidden');
    formCardHeaderInput.classList.remove('hidden');
    formCardHeaderInput.focus();
  } else {
    textField.focus();
  }

  createBlocker(form);
  submitButton.addEventListener('click', submitEvent);

  function createBlocker(modal) {
    blocker = document.createElement('div');
    for (let i in blockerObj) {
      blocker.style[i] = blockerObj[i];
    }

    blocker.addEventListener('click', function () {
      submitButton.removeEventListener('click', submitEvent);
      formHeader.classList.add('hidden');
      formCardHeaderInput.classList.add('hidden');
      modal.classList.add('hidden');
      textField.value = '';
      blocker.remove();
    })

    page.appendChild(blocker);
  }

  function submitEvent(evt) {
    evt.preventDefault();

    try {
      if (operationId === 'new card' && formCardHeaderInput.value == 0) throw new NoTextError('Заполните все поля!');
      if (textField.value == 0) throw new NoTextError('Заполните все поля!');
    } catch (error) {
      alert(error.message);
      return;
    }

    switch (operationId) {
      case 'new card':
        formHeader.classList.add('hidden');
        formCardHeaderInput.classList.add('hidden');
        form.classList.add('hidden');
        blocker.remove();
        createNewCard();
        break;
      case 'new task':
        form.classList.add('hidden');
        blocker.remove();
        createTask(card);
        break;
    }
    submitButton.removeEventListener('click', submitEvent);
  }
}