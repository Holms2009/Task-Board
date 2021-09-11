'use strict'

function showForm(operationId, card) {
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

