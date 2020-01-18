import {md5} from 'pure-md5';
import ProfileBlock from './profile.js';
import MessagesBlock from './messages.js';

export default class ConversationsBlock {
    constructor(root) {
        this.root = root;
        this.threads = [];
        this.myID;
    }
    
    findSender(arr) {
        return arr.find((el)=> !el.me);
    }
    
    findMyId(arr) {
        arr.forEach((obj)=> {
            if (obj.me) this.myID = obj['_id'];
        });
    }
    
    createAllThreads() {
        getConversations().then((resp) => {
            if(resp.status === 200) {
                return resp.json();
            } else {
                throw new Error('bad response from getThread');
            }
        })
        .then((resp) => {
            // console.log(resp)
            if (resp.length > 0) {
                this.findMyId(resp[0].users);

                for(let i = 0; i < resp.length; i++) {
                    
                    let obj = resp[i];
                    
                    let thread = this.createThread(
                        this.findSender(obj.users).name, 
                        obj.last_message, 
                        this.findSender(obj.users).email, 
                        obj.updated_at
                    );

                    this.threads.push(obj);
                    
                    thread.addEventListener('click', () => {

                        // let threads = document.querySelectorAll('.conversation')
                        

                        let chat = document.querySelector('#chat');
                        let messBlock = new MessagesBlock(chat);
                        
                        getThreadMessages(obj['_id'])
                        .then((resp) => {
                            if (resp.status === 200) {
                                return resp.json();
                            } else {
                                throw new Error('Bad response');
                            }
                        })
                        .then((resp)=> {
                            // console.log(obj)
                            let chatContainer = messBlock.createChatContainer();
                            let form = messBlock.createForm(obj, chatContainer);

                            let sortedMessages = resp.messages.sort((a,b) => {
                                let dateA = new Date(a.created_at) 
                                let dateB = new Date(b.created_at)
                                return dateA - dateB
                            })

                            // console.log(sortedMessages)
                            // console.log(resp.messages)
                            // console.log(resp)

                            sortedMessages.forEach((message)=>{
                                //make it less dumb
                                let userEmail = obj.users.filter((obj) => {
                                    if (obj['_id'] === message.user) {
                                        return obj
                                    }
                                })

                                // if ((message.user === this.myID)) {
                                //     chatContainer.append(messBlock.createToMessage(message, userEmail));
                                // } else {
                                //     chatContainer.append(messBlock.createFromMessage(message, userEmail));
                                // } 
                                let isMe = message.user === this.myID;
                                chatContainer.append(messBlock.createMessage(message, userEmail[0], isMe))
                                
                            });
                            messBlock.createMessagesBlock(chatContainer, form);
                            chatContainer.scrollTop = chatContainer.scrollHeight;

                            return resp;
                        })
                        .then((resp)=> {
                            let profileRoot = document.querySelector('#profile-container__wrap')
                            let profile = new ProfileBlock(profileRoot); 
                            // console.log(this.findSender(resp.users))
                            profile.createBlock(this.findSender(resp.users));
                        }).then(()=> {
                            let conv = document.getElementsByClassName('conversation')
                    
                            console.log(conv);
                            for (let i = 0; i < conv.length; i++) {
                                if (conv[i].classList.contains('conversation_active')) {
                                    conv[i].classList.toggle('conversation_active');    
                                }
                            }
                            thread.classList.add('conversation_active');
                            
                        })
                        .catch((error)=> {
                            console.log(error)
                        });
                    });

                    this.root.append(thread);
                    
                    // classList.toggle('conversation_active');

                    if (i === 0) {
                        thread.click();
                    }
                }
            } //else {
            //     console.log(1)
            //     let addThreadBlock = this.createaddThreadBtn();
            //     this.root.append(addThreadBlock);
            // }
        });
    }

    // createaddThreadBtn() {
    //     let container = document.createElement('div');
    //     container.classList.add('conversations__add-new-conversation-block');
        
    //     let btn = document.createElement('span');
    //     btn.classList.add('conversations__text', 'conversations__text_color_white')
    //     container.append(btn);
        
    //     return container;
    // }

    startThread(id) {
        //check if there is not a thread with such id
        if (!this.threads.some( (el) => (el.users.map((el) => el['_id'])).includes(id))) {
            // console.log("ok!");
            startThread(id).then((resp)=> {
                // console.log(resp)
                while (this.root.firstChild) {
                    this.root.removeChild(this.root.firstChild);
                }
                this.createAllThreads();
            });
        } else {
            console.log('You already have such a thread!')
        }
    }

    createThread(name, message, email, date) {
        let conversation = document.createElement('div');
        conversation.setAttribute('class', 'conversation');

        let conversation__wrap = document.createElement('div');
        conversation__wrap.setAttribute('class', 'conversation__wrap');

        let conversation__header = document.createElement('div');
        conversation__header.setAttribute('class', 'conversation__header');

        let conversation__user = document.createElement('div');
        conversation__user.setAttribute('class', 'conversation__user');
        
        let hash = md5(email.toLowerCase());
        // console.log(hash)
        let img = document.createElement('img');
        img.setAttribute('src', 'https://www.gravatar.com/avatar/' + hash + '?s=60&d=wavatar')
        img.setAttribute('class', 'conversation__user-photo');
        img.setAttribute('alt', 'user photo');

        let conversation__name = document.createElement('span');
        conversation__name.setAttribute('class', 'conversation__name')
        conversation__name.textContent = name;

        const formatedDate = (date) => {
            date = new Date(Date.parse(date));
            return `${date.getDate()}.${date.getMonth() < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1}.${date.getFullYear()}`
        }

        let conversation__date = document.createElement('span');
        conversation__date.setAttribute('class', 'conversation__date conversation__date_viewed');
        conversation__date.textContent = formatedDate(date);
        
        let conversation__message = document.createElement('p');
        conversation__message.setAttribute('class', 'conversation__message');

        message = typeof(message) === 'string' ? message : message.body
        conversation__message.textContent = message;

        conversation.append(conversation__wrap);
        conversation__wrap.append(conversation__header);

        conversation__header.append(conversation__user);
        conversation__user.append(img);
        conversation__user.append(conversation__name);
        conversation__header.append(conversation__date);
        conversation__wrap.append(conversation__message);
        
        return conversation;
    }
}

async function getConversations() {
    return await fetch('https://geekhub-frontend-js-9.herokuapp.com/api/threads', { 
        headers: {
            "x-access-token": localStorage.token
        }})
        .then((resp) => {
            return resp;
        })
        .catch((error)=> {
            console.log(error);
        });
}

async function startThread(id) {
    let obj = {
        'user': {
            '_id': id
        }
    }

    return await fetch('https://geekhub-frontend-js-9.herokuapp.com/api/threads', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': localStorage.token
        },
        body: JSON.stringify(obj)
    })
    .then((resp) => {
        return resp;
    })
    .catch((error)=> {
        console.log(error);
    });
}

async function getThreadMessages(threadId) {
    // let obj = {
    //     'thread':{
    //         '_id': threadId
    //     }
    // }
    return await fetch('http://localhost:3000/api/threads/messages/'+threadId, {
        method: 'get',
        headers:{
            'x-access-token': localStorage.token,
            'Content-Type': 'application/json'
        }/*,
        body : JSON.stringify(obj)*/
        }).then((resp)=> {
        return resp;
    })
}
