'use strict'

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

            document.addEventListener('mouseup', () => {
                checkBorders(card);
                savePosition(card, card.style.left, card.style.top);
                document.removeEventListener('mousemove', onMouseMove);
                card.style.zIndex = 0;
            });
        }
    });
}

function savePosition(card, left, top) {
    let destinationCard = savedCards.find(item => item.id == card.id);
    destinationCard.left = left;
    destinationCard.top = top;
    localStorage.savedCards = JSON.stringify(savedCards);
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