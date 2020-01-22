import {isFilled, validEmail, validPassword, validName} from '../scripts/validation';

signUpform.addEventListener("submit", (event) => {
    event.preventDefault();
    let email = document.getElementById("email");
    let password = document.getElementById('password');
    let name = document.getElementById('name');

    validEmail(email);
    validPassword(password);
    validName(name);
    
    if (isFilled(email, password, name)) {
        Send(email.value, password.value, name.value)
        .then((resp) => {
            if (resp.status === 200) {
                window.location.href = '../../../index.html'
            } else {
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
    }
});

async function Send(email, password, name) {

    let obj = {
    'email': email,
    'password': password,
    'name': name
    }
    return await fetch('//https://geekhub-frontend-js-9.herokuapp.com/api/users/', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
    })
    .then((response) => response);
}