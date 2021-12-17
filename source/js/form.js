(function () {
    let me = {};
    let form = document.querySelector('.form-container');
    let closeButton = null;

    function onClose(e) {
        me.close();
        closeButton.removeEventListener('click', onClose);
    }

    me.open = function () {
        form.classList.remove('is-hidden');

        closeButton = document.querySelector('.form__close-button');
        closeButton.addEventListener('click', onClose);
        window.onkeydown = function (event) {
            if (event.key === 'Escape') {
                me.close();
            }
        };
    }

    me.close = function () {
        form.classList.add('is-hidden');
    }

    me.isValid = function () {
        if (me.isAllCompleted(document.querySelectorAll('[data-valid="required"]'))) {
            console.log('Заполните все необходимые поля');
            return false;
        } else if (!ITVDN.validation.isEmail(document.querySelector('[data-email]').value)) {
            console.log('Неверный email');
            return false;
        } else if (!ITVDN.validation.isNumber(document.querySelector('[data-number]').value)) {
            console.log('Неверный number');
            return false;
        }
        return true;
    };

    me.isAllCompleted = function (data) {
        let result = true;
        for (let i = 0; i < data.length; i++) {
            if (ITVDN.validation.isNotEmpty(data[i].value)) {
                result = false;
                break;
            }
        }
        return result;
    };

    ITVDN.form = me;
}());