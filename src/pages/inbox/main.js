import ConversationsBlock from'./scripts/conversations';
import validateToken from '../authorization/scripts/validateCurrent.js'
import {md5} from 'pure-md5'

// localStorage.token = 'as'
validateToken(localStorage.token).then((resp)=> {
    if(resp.status === 200) {
        return resp.json();
    } else {
        window.location.href = '/dist/index.html';
    }
}).then((resp)=> {
    console.log(resp.email)
    let hash = md5(resp.email.toLowerCase()); 
    let img = document.querySelector('#header-menu__user-photo');
    img.setAttribute('src', 'https://www.gravatar.com/avatar/' + hash + '?d=wavatar&s=60');
})

let convContainer = document.querySelector('#conversations-container');

// let container = document.querySelector('.page-messages__messages');

let newThreadBtn = document.querySelector('#conversations__add-conversation-btn');
// let convBlock = new ConversationsBlock(container);
let convBlock = new ConversationsBlock(convContainer);

convBlock.createAllThreads();

newThreadBtn.addEventListener('click', () => {
    let id = prompt("id: ");
    if (id.length !== 24) {
        console.log('Id is wrong');
    } else {
        convBlock.startThread(id);
    }
});
