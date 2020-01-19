import SendCurrent from '../scripts/validateCurrent'
import {isFilled, validEmail, validPassword} from '../scripts/validation.js';

if (localStorage.token) {
    SendCurrent(localStorage.token)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error("Bad response")
      }
    })
    .then((response) => {
        localStorage.setItem('myId', response['_id'])
        localStorage.setItem('myEmail', response.email)
        window.location.href = '/pages/inbox/inbox.html';
    })
    .catch((error)=> {
      console.log(error);
    });
}

LogInForm.addEventListener("submit", (event) => {
    event.preventDefault();
    
    let email = document.getElementById("email");
    let password = document.getElementById('password');

    validEmail(email);
    validPassword(password);

    if (isFilled(email, password)) {
        Send(email.value, password.value).then((response) => {
        
            if (response.status === 200) {                
                localStorage.setItem('token', response.headers.get('x-auth-token'))
                return response.json();
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
        .then((resp) => {            
            localStorage.setItem('myId', resp['_id'])
            localStorage.setItem('myEmail', resp.email)
            window.location.href = '/pages/inbox/inbox.html'
        })
        .catch((error)=> { console.log(error) })
    }
});

async function Send(email, password) {

    let obj = {
    "email": email,
    "password": password
    }
    
    console.log(obj)
    
    return await fetch('https://geekhub-frontend-js-9.herokuapp.com/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })
    .then((response) => {
        return response;
    })
}
