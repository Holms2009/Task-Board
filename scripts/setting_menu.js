'use strict'

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

fontSizeHandler.addEventListener('input', function() {
    let cards = board.querySelectorAll('.board-card');
    for (let card of cards) {
        card.style.fontSize = fontSizeHandler.value + 'px';
    }
    userSettings.cardsFontSize = fontSizeHandler.value + 'px';
    localStorage.userSettings = JSON.stringify(userSettings);
})

