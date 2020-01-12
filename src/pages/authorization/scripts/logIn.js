import CreatePage from './createPage.js';
import SignUpPage from './signUp.js';
import ResetPage from './reset.js';

import {isFilled, validEmail, validPassword} from './validation.js'

export default class CreateLogInPage extends CreatePage{
    createPage() {
        let logo = this.addLogo();

        let title = this.addTitle('Log In');

        let form = this.addForm('http://localhost:3000/api/users/login', 'POST', 'auth-form');

        let singUpAnchor = this.addLink('Not a member?');
        singUpAnchor.addEventListener('click', () => {
            // this.root.innerHTML = '';
            while (this.root.hasChildNodes()) {
                this.root.removeChild(this.root.lastChild);
            }

            let page = new SignUpPage(this.root);
            page.createPage();
        })

        let email = this.addInput('email', 'email', 'email', 'auth-container__input', 'Email')
        let password = this.addInput('password', 'password', 'password','auth-container__input', 'Password')

        let subm = this.addSubmit("Log In");

        form.addEventListener("submit", (event) => {
            event.preventDefault();
            
            validEmail(email)
            validPassword(password);

            if (isFilled(email, password)) {
                Send().then((response) => {
        
                    if (response.status === 200) {
                        localStorage.setItem('token', response.headers.get('x-auth-token'))
                        window.location.href = '/dist/pages/inbox/inbox.html'; 
                        // return response.json();
                    } else {
                        if (document.getElementsByClassName('auth-container__bad-response').length < 1) {
                            let badResponse = document.createElement('p');
                            badResponse.setAttribute('class', 'auth-container__bad-response');
                            badResponse.textContent = 'Password or email is wrong';
                            document.body.after(badResponse);
                        }
                        
                        // email.classList.add('auth-container__input_border_red');
                        // password.classList.add('auth-container__input_border_red');
                        
                        // // email.value = 'jolene@geekhub.ck.ua';
                        // // password.value ='alex@geekh'
                        // email.addEventListener('focus', () => {
                        //     email.classList.remove('auth-container__input_border_red');
                            
                        // });
                        
                        // password.addEventListener('focus', () => {
                        //     password.classList.remove('auth-container__input_border_red');
                        // });
                        // throw new Error('Bad status');
                    }
                })
                // .then((resp) => {
                //     // console.log(resp);
                //     window.location.href = '/dist/pages/inbox/inbox.html';
                // })
                .catch((eror) => console.log(eror));
            }
        });

        let forgotPasswordAnchor =  this.addLink('Forgot Password?');
        forgotPasswordAnchor.style.alignSelf = 'center';
        forgotPasswordAnchor.addEventListener('click', () => {
            // this.root.innerHTML = '';
            while (this.root.hasChildNodes()) {
                this.root.removeChild(this.root.lastChild);
            }

            let page = new ResetPage(this.root);
            page.createPage();
        })

        this.root.append(logo);
        this.root.append(title);
        this.root.append(singUpAnchor);
        form.append(email);
        form.append(password);
        form.append(subm);
        this.root.append(form);
        this.root.append(forgotPasswordAnchor);
    }
}

async function Send() {
    let email = document.getElementById("email").value;
    let pass = document.getElementById('password').value;

    let obj = {
    "email": email,
    "password": pass
    }
    
    console.log(obj)
    
    return await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })
    .then((response) => {
        // console.log(response)
        return response;
        // if (response.status !== 200 && document.getElementsByClassName('auth-container__bad-response').length < 1) {
        //     let badResponse = document.createElement('p');
        //     badResponse.setAttribute('class', 'auth-container__bad-response');
        //     badResponse.textContent = 'Password or email is wrong';
        //     document.body.after(badResponse);
        // } 
        // if (response.status === 200) {
        //     localStorage.setItem('token', response.headers.get('x-auth-token'))
        //     // window.location.href = '/dist/inbox/index.html';
        //     return response.json();
        // }
    })
}
