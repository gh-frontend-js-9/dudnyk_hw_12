import CreatePage from "./createPage";
import SignUpPage from './signUp.js';
import LogInPage from './logIn.js';

import {isFilled, validEmail, validPassword, validPasswords} from './validation.js'

export default class CreateResetPasswordPage extends CreatePage{
    createPage() {
        let logo = this.addLogo();

        let title = this.addTitle('Reset password');

        let form = this.addForm('localhost:3000/api/users/reset_password', 'POST', 'auth-form');
        
        let signUpAnchor = this.addLink('Not a member?');
        signUpAnchor.addEventListener('click', () => {
            // this.root.innerHTML = '';
            while (this.root.hasChildNodes()) {
                this.root.removeChild(this.root.lastChild);
            }

            let page = new SignUpPage(this.root);
            page.createPage();
        })


        let email = this.addInput('email', 'email', 'email', 'auth-container__input', 'Email');
        let password = this.addInput('password', 'password', 'password','auth-container__input', 'Password');
        let confirmationPassword = this.addInput('password', 'password', 'confirm-password','auth-container__input', 'Confirmation password');

        let subm = this.addSubmit('Sign Up');
        
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            validEmail(email);
            validPassword(password);
            validPasswords(password, confirmationPassword)

            if (isFilled(email, password, confirmationPassword)) {
                Send(localStorage.token);
                // this.root.innerHTML = '';
                while (this.root.hasChildNodes()) {
                    this.root.removeChild(this.root.lastChild);
                }

                let page = new LogInPage(this.root);
                page.createPage();
            }
        });

        this.root.append(logo);
        this.root.append(title);
        this.root.append(signUpAnchor);
        form.append(email);
        form.append(password);
        form.append(confirmationPassword);
        form.append(subm);
        this.root.append(form);
    }
}

async function Send(token) {
    let email = document.getElementById("email").value;
    let password = document.getElementById('password').value;
    let confirmationPassword = document.getElementById('confirm-password').value;

    let obj = {
    'password': password,
    'confirmationPassword': confirmationPassword,
    'email': email
    }
    
    console.log(obj)
    
    let response = await fetch('http://localhost:3000/api/users/reset_password', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'x-access-token': token
    },
    body: JSON.stringify(obj)
    })
    // .then((response) => {
    // console.log(response);
    // console.log(response.headers.get('x-auth-token'))
    // })
}