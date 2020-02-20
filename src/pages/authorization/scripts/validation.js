export function isFilled(...inps) {
    return !inps.some(inp => inp.classList.contains('auth-container__input_border_red'))
}

export function validEmail(inp) {
    if (!isValidEmail(inp.value, 5, 255) && !inp.classList.contains('auth-container__input_border_red')) { 
        required(inp, 'Email must be greater than 5 and less than 255 and include @');

    } else if (isValidEmail(inp.value, 5, 255) && inp.classList.contains('auth-container__input_border_red')) {
        inp.classList.toggle('auth-container__input_border_red');
        inp.nextSibling.remove()
    }
}

function isValidEmail(email) {
    let re = /\S+@\S+\.\S+/;
    return re.test(email) && isValidLength(email, 5, 255);
}

function isValidLength(text, min, max) {
    return min <= text.length && text.length <= max;
}

export function validPassword(inp) {
    if (!isValidLength(inp.value, 8, 255) && !inp.classList.contains('auth-container__input_border_red')) {
        required(inp, 'Password must be greater than 8 and less than 255.');

    } else if (isValidLength(inp.value, 8, 255) && inp.classList.contains('auth-container__input_border_red')) {
        inp.classList.toggle('auth-container__input_border_red');
        inp.nextSibling.remove()
    }
}

export function validName(inp) {
    if (!isValidLength(inp.value, 5, 255) && !inp.classList.contains('auth-container__input_border_red')) {
        required(inp, 'Must be filled')

    } else if (isValidLength(inp.value, 5, 255) && inp.classList.contains('auth-container__input_border_red')) {
        inp.classList.toggle('auth-container__input_border_red');
        inp.nextSibling.remove()
    } 
}

export function validPasswords(pass1, pass2) {
    if (pass1.value !== pass2.value && !pass2.classList.contains('auth-container__input_border_red')) {
        required(pass2, 'Passwords do not match')

    } else if (pass1.value === pass2.value && pass2.classList.contains('auth-container__input_border_red')) {
        pass2.classList.toggle('auth-container__input_border_red');
        pass2.nextSibling.remove()
    }
}

function required(element, text) {
    element.classList.toggle('auth-container__input_border_red');
    let explanation = document.createElement('p');
    explanation.setAttribute('class', 'auth-container__error-message')
    explanation.textContent = text
    element.after(explanation)
}