import '../../assets/scss/style.scss';
import ConversationsBlock from'./scripts/conversations';
import validateToken from '../authorization/scripts/validateCurrent.js'
import {md5} from 'pure-md5'

// localStorage.token = 'as'


let convContainer = document.querySelector('#conversations-container');

let newThreadBtn = document.querySelector('#conversations__add-conversation-btn');
let convBlock = new ConversationsBlock(convContainer);

convBlock.createAllThreads();

newThreadBtn.addEventListener('click', () => {
    convBlock.startThread();
});
