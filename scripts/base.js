'use strict'

let page = document.querySelector('body');
let board = page.querySelector('.board');
let clearBoardButton = page.querySelector('.clear-board');
let addCardButton = page.querySelector('.add-card');
let cardTemplate = board.querySelector('#card-template').content.querySelector('.board-card');
let taskTemplate = board.querySelector('#task-template').content.querySelector('.board-card__item');
let cardId = 1;
let form = page.querySelector('.card-contents');
let textField = form.querySelector('.card-contents__text');
let submitButton = form.querySelector('.card-contents__submit-button');
let formHeader = form.querySelector('.card-contents__header-1');
let formCardHeaderInput = form.querySelector('.card-contents__card-header');
let blocker;
let savedCards = [];

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