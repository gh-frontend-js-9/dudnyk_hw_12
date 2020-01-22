import {md5} from 'pure-md5';
import ProfileBlock from './profile.js';
import MessagesBlock from './messages.js';

export default class ConversationsBlock {
    constructor(root) {
        this.root = root;
        this.threads = [];
    }
    
    findSender(arr) {
        let interlocutor = arr.find((el) => el['_id'] !== localStorage.myId);
        if (interlocutor) return interlocutor; 
        else return arr[0];
    }

    createAllThreads() {
        SendGetConversationsRequest()
        .then((resp) => {
            if(resp.status === 200) {
                return resp.json();
            } else {
                throw new Error('bad response from getThread');
            }
        })
        .then((resp) => {
            // console.log(resp)
            if (resp.length > 0) {

                for(let i = 0; i < resp.length; i++) {
                    
                    let obj = resp[i];
                    // console.log(obj)
                    SendGetUserByIdRequest(this.findSender(obj.users)['_id'])
                    .then((resp) => resp.json())
                    .then((resp) => { 
                        let senderEmail = resp.email
                        let thread = this.createThread(
                            this.findSender(obj.users).name, 
                            obj.updated_at,
                            obj.message,
                            resp.email
                        );

                        this.threads.push(obj);
                        
                        thread.addEventListener('click', () => {
                            let conv = document.getElementsByClassName('conversation')
                        
                            for (let i = 0; i < conv.length; i++) {
                                if (conv[i].classList.contains('conversation_active')) {
                                    conv[i].classList.toggle('conversation_active');    
                                }
                            }
                            
                            thread.classList.add('conversation_active');

                            let chat = document.querySelector('#chat');
                            let messBlock = new MessagesBlock(chat);
                            // let myPhotoUrl = await fetch()

                            
                            SendGetThreadMessagesRequest(obj['_id'])
                            .then((resp) => {
                                if (resp.status === 200) {
                                    return resp.json();
                                } else {
                                    throw new Error('Bad response');
                                }
                            })
                            .then((resp)=> {
                                let chatContainer = messBlock.createChatContainer();
                                let form = messBlock.createForm(obj, chatContainer);

                                if (resp.length > 0) {
                                    resp.forEach((el) => {
                                        let isMe = localStorage.myId === el.user['_id']
                                        let email = isMe ? localStorage.myEmail : senderEmail
                                        chatContainer.append(messBlock.createMessage(el, getHash(email), isMe))
                                    })
                                }                        
                                console.log(resp)
                        
                                messBlock.createMessagesBlock(chatContainer, form);
                                chatContainer.scrollTop = chatContainer.scrollHeight;

                                return resp;
                            })
                            .then((resp)=> {
                                let sender = this.findSender(obj.users)['_id'];
                                SendGetUserByIdRequest(sender)
                                .then((resp) => {
                                    if (resp.status === 200) {
                                        return resp.json()
                                    } else throw new Error('cant get user by id');
                                }).then((resp)=> {    
                                    let profileRoot = document.querySelector('#profile-container__wrap')
                                    let profile = new ProfileBlock(profileRoot);
                                    profile.createBlock(resp);
                                }).catch((error)=> { console.log(error) })
                            
                                // console.log(this.findSender(resp.users))
                                // // console.log(resp)
                                // profile.createBlock(this.findSender(resp.users));
                            })
                            .catch((error) => {
                                console.log(error)
                            });
                        });

                        this.root.append(thread);

                        if (i === 0) {
                            thread.click();
                        }
                    })
                }
            } 
        });
    }

    startThread() {
        SendGetAllUsersReques()
        .then((resp) => {
            console.log(resp)
            if (resp.status === 200) {
                return resp.json();
            } else {
                throw new Error ('Can not get all users')
                
            }
        })
        .then((resp) => {
            let usersBackground = document.createElement('div');
            usersBackground.setAttribute('class', 'all-users');

            let container = document.createElement('div');
            container.setAttribute('class', 'all-users__container');
            
            let titleContainer = document.createElement('div');
            titleContainer.setAttribute('class', 'all-users__title-container');
            
            let title = document.createElement('span');
            title.setAttribute('class', 'all-users__title');
            title.textContent = 'Create thread with...';

            let exit = document.createElement('span');
            exit.setAttribute('class', 'all-users__exit');
            exit.innerHTML = '&#x2716;';

            exit.addEventListener('click', () => {
                container.remove();
                usersBackground.remove();
                return;
            });

            usersBackground.addEventListener('click', () => {
                container.remove();
                usersBackground.remove();
                return;
            });

            titleContainer.append(title, exit);
            container.append(titleContainer);

            let userContainer = document.createElement('div');
            userContainer.setAttribute('class', 'all-users__user-container')
    
            resp.forEach((el) => {
                let isRepeats = this.threads.some((thread) => this.findSender(thread.users)['_id'] === el['_id']);
                if (isRepeats) {
                   return el;
                }

                let user = document.createElement('div');
                user.setAttribute('class', 'all-users__user');

                let span = document.createElement('span');
                span.textContent = el.name;
                
                user.append(span);
                
                user.addEventListener('click', () => {
                    container.remove();
                    usersBackground.remove();
    
                    SendStartThreadRequest(el['_id'])
                    .then((resp) => {
                        if (resp.status === 200) {
                            while (this.root.firstChild) {
                                this.root.removeChild(this.root.firstChild);
                            }
                            this.createAllThreads();
                        } 
                        else throw new Error ('Can`t create thread');  
                    }) 
                });

                userContainer.append(user);
            });

            container.append(userContainer);
            usersBackground.append(container);

            document.body.append(usersBackground, container);
        })
    }
    

    createThread(name, date, message, email) {
        console.log(message)
        let conversation = document.createElement('div');
        conversation.setAttribute('class', 'conversation');

        let conversation__wrap = document.createElement('div');
        conversation__wrap.setAttribute('class', 'conversation__wrap');

        let conversation__header = document.createElement('div');
        conversation__header.setAttribute('class', 'conversation__header');

        let conversation__user = document.createElement('div');
        conversation__user.setAttribute('class', 'conversation__user');

        let img = document.createElement('img');
        img.setAttribute('src', 'https://www.gravatar.com/avatar/' + getHash(email) + '?s=60&d=wavatar')
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

        message = message == null ? message : message.body;
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

export function getHash(email) {
    return md5(email.toLowerCase());
}

async function SendGetConversationsRequest() {
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

async function SendGetAllUsersReques() {
    return await fetch('https://geekhub-frontend-js-9.herokuapp.com/api/users/all', {
        headers: {
            'x-access-token': localStorage.token
        }
    })
    .then((resp) => {
        return resp;
    })
}

async function SendStartThreadRequest(id) {
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

async function SendGetThreadMessagesRequest(threadId) {
    return await fetch('https://geekhub-frontend-js-9.herokuapp.com/api/threads/messages/'+threadId, {
        method: 'get',
        headers:{
            'x-access-token': localStorage.token,
            'Content-Type': 'application/json'
        }
    })
    .then((resp)=> { return resp })
}

async function SendGetUserByIdRequest(id) {
    return await fetch('https://geekhub-frontend-js-9.herokuapp.com/api/users/' + id, {
        headers: {
            'x-access-token': localStorage.token
        }
    }).then((resp)=> resp)
}