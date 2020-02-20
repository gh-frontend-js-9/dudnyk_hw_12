import '../assets/scss/style.scss';
import { removeChildrens, createNewElement } from './functions.js';
import { md5 } from 'pure-md5';
import { sendCurrentUserRequest } from './requests.js';
import ChartPage from'./chart/chart.js';

//validate user
sendCurrentUserRequest(localStorage.token).then((resp)=> {
    if(resp.status === 200) {
        return resp.json();
    } else {
        window.location.href = '/index.html';
    }
}).then((resp)=> {
    localStorage.setItem('myId', resp['_id'])
    localStorage.setItem('myEmail', resp.email)
    // console.log(resp.email)
    let hash = md5(resp.email.toLowerCase()); 
    let img = document.querySelector('#header-menu__user-photo');
    img.setAttribute('src', 'https://www.gravatar.com/avatar/' + hash + '?d=wavatar&s=60');
}).catch((error) => {
    console.log(error);
})


let contentSpace = document.getElementsByClassName('content')[0];
let messagesBtn = document.getElementById('messages');

messagesBtn.addEventListener('click', () => {
    
    removeChildrens(contentSpace);
    let container = createNewElement('div', '', ['content__wait-screen']); 
    let message = createNewElement('p', 'Page is currently unavailable. The developer also wants to sleep. Wait a little bit)', ['content__text'])
    container.append(message);
    contentSpace.append(container);
})

home.addEventListener('click', () => {

    removeChildrens(contentSpace);
    let container = createNewElement('div', '', ['content__wait-screen']); 
    let message = createNewElement('p', 'Page is currently unavailable. The developer also wants to sleep. Wait a little bit)', ['content__text'])
    container.append(message);
    contentSpace.append(container);
})


menu.addEventListener('click', () => {
  
    removeChildrens(contentSpace);
    let container = createNewElement('div', '', ['content__wait-screen']); 
    let message = createNewElement('p', 'Page is currently unavailable. The developer also wants to sleep. Wait a little bit)', ['content__text'])
    container.append(message);
    contentSpace.append(container);
});


chart.addEventListener('click', () => {
    removeChildrens(contentSpace);
    let page = new ChartPage(contentSpace);
    page.create();
});


friends.addEventListener('click', () => {
    
    removeChildrens(contentSpace);
    let container = createNewElement('div', '', ['content__wait-screen']); 
    let message = createNewElement('p', 'Page is currently unavailable. The developer also wants to sleep. Wait a little bit)', ['content__text'])
    container.append(message);
    contentSpace.append(container);
});


