import {isFilled, validEmail, validPassword, validPasswords} from '../scripts/validation'


resetForm.addEventListener('submit', (event) => {
    let email = document.getElementById("email");
    let password = document.getElementById('password');
    let confirmationPassword = document.getElementById('confirm-password');

    event.preventDefault();

    validEmail(email);
    validPassword(password);
    validPasswords(password, confirmationPassword)

    if (isFilled(email, password, confirmationPassword)) {
        Send(email.value, password.value, confirmationPassword.value)
        .then((resp) => {
        
            if (resp.status === 200) {
                window.location.href = '../../../index.html';
            }
            else {
                let errorMessages = document.getElementsByClassName('auth-container__bad-response');
                if (errorMessages.length !== 0) {
                    for (let i = 0; errorMessages.length !== 0; i++) {
                        errorMessages[i].remove();
                    }
                } 
                let badResponse = document.createElement('p');
                badResponse.setAttribute('class', 'auth-container__bad-response');
                badResponse.textContent = "User does not exist";
                document.body.after(badResponse);
            }
        })
        .catch((error)=> { console.log(error) })
    };
})

async function Send(email, password, confirmationPassword) {

    let obj = {
    'password': password,
    'confirmationPassword': confirmationPassword,
    'email': email
    }
    
    console.log(obj)
    
    return await fetch('https://geekhub-frontend-js-9.herokuapp.com/api/users/reset_password', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    'x-access-token': localStorage.token
    },
    body: JSON.stringify(obj)
    })
    .then((response) => response)
}