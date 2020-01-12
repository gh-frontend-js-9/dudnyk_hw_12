import '../../assets/scss/style.scss';
import SendCurrent from './scripts/validateCurrent.js'

import login from './scripts/logIn.js';

function CreateLogInPage() {
  let container = document.createElement('div');
  container.setAttribute('class', 'auth-container');
  document.body.appendChild(container);

  let firstPage = new login(container);
  firstPage.createPage();
}

// export default async function SendCurrent(token) {
//   return await fetch('http://localhost:3000/api/users/current', {
//     headers: {
//       "x-access-token": token
//     }
//   })
//   .then((response) => {
//     return response;
//   });
// }

window.onload = () => {
  // console.log(localStorage.token);
  // localStorage.token = "asd";
  if (localStorage.token) {
    SendCurrent(localStorage.token).then((response) => {

      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error("Bad response")
      }
    })
    .then((response) => {
      window.location.href = '/dist/pages/inbox/inbox.html';
    })
    .catch((error)=> {
      console.log(error);
      CreateLogInPage();
    }) 

  } else {
    CreateLogInPage();
  }
}
