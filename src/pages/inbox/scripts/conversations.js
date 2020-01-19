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
            console.log(resp)
            if (resp.length > 0) {

                for(let i = 0; i < resp.length; i++) {
                    
                    let obj = resp[i];
                    
                    let thread = this.createThread(
                        this.findSender(obj.users).name, 
                        // obj.last_message, 
                        // this.findSender(obj.users).email, 
                        obj.updated_at
                    );

                    this.threads.push(obj);
                    
                    thread.addEventListener('click', () => {

                        let chat = document.querySelector('#chat');
                        let messBlock = new MessagesBlock(chat);
                        
                        SendgetThreadMessagesRequest(obj['_id'])
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
                            // console.log(this.findSender(obj))
                            // let sortedMessages = resp.messages.sort((a,b) => {
                            //     let dateA = new Date(a.created_at) 
                            //     let dateB = new Date(b.created_at)
                            //     return dateA - dateB
                            // })

                            // sortedMessages.forEach((message)=>{
                            //     //make it less dumb
                            //     let userEmail = obj.users.filter((obj) => {
                            //         if (obj['_id'] === message.user) {
                            //             return obj
                            //         }
                            //     })

                            //     let isMe = message.user === this.myID;
                            //     chatContainer.append(messBlock.createMessage(message, userEmail[0], isMe))
                                
                            // });

                            if (resp.length > 0) {
                                
                            }
                        
                            console.log(resp)
                            // chatContainer.append(messBlock.createMessage())
                            
                            messBlock.createMessagesBlock(chatContainer, form);
                            chatContainer.scrollTop = chatContainer.scrollHeight;

                            return resp;
                        })
                        .then((resp)=> {
                            // let profileRoot = document.querySelector('#profile-container__wrap')
                            // let profile = new ProfileBlock(profileRoot); 
                            // // console.log(this.findSender(resp.users))
                            // console.log(resp)
                            // profile.createBlock(this.findSender(resp.users));
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

                    if (i === 0) {
                        thread.click();
                    }
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
            
            let exitContainer = document.createElement('div');
            exitContainer.setAttribute('class', 'all-users__exit-container')
            
            let exit = document.createElement('span');
            exit.setAttribute('class', 'all-users__exit')
            exit.innerHTML = '&#x2716;';

            exitContainer.append(exit)

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

            container.append(exitContainer);

            let userContainer = document.createElement('div');
            userContainer.setAttribute('class', 'all-users__user-container')

            resp.forEach((el) => {
               
                let user = document.createElement('div');
                user.setAttribute('class', 'all-users__user');

                let span = document.createElement('span');
                span.textContent = el.name
                
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
    

    createThread(name, date) {
        let conversation = document.createElement('div');
        conversation.setAttribute('class', 'conversation');

        let conversation__wrap = document.createElement('div');
        conversation__wrap.setAttribute('class', 'conversation__wrap');

        let conversation__header = document.createElement('div');
        conversation__header.setAttribute('class', 'conversation__header');

        let conversation__user = document.createElement('div');
        conversation__user.setAttribute('class', 'conversation__user');

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
        
        conversation.append(conversation__wrap);
        conversation__wrap.append(conversation__header);

        conversation__header.append(conversation__user);
        conversation__user.append(conversation__name);
        conversation__header.append(conversation__date);
        
        return conversation;
    }
}


// old create thread    
//     createThread(name, message, email, date) {
//         let conversation = document.createElement('div');
//         conversation.setAttribute('class', 'conversation');

//         let conversation__wrap = document.createElement('div');
//         conversation__wrap.setAttribute('class', 'conversation__wrap');

//         let conversation__header = document.createElement('div');
//         conversation__header.setAttribute('class', 'conversation__header');

//         let conversation__user = document.createElement('div');
//         conversation__user.setAttribute('class', 'conversation__user');
        
//         let img = document.createElement('img');
//         img.setAttribute('src', 'https://www.gravatar.com/avatar/' + getHash(email) + '?s=60&d=wavatar')
//         img.setAttribute('class', 'conversation__user-photo');
//         img.setAttribute('alt', 'user photo');

//         let conversation__name = document.createElement('span');
//         conversation__name.setAttribute('class', 'conversation__name')
//         conversation__name.textContent = name;

//         const formatedDate = (date) => {
//             date = new Date(Date.parse(date));
//             return `${date.getDate()}.${date.getMonth() < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1}.${date.getFullYear()}`
//         }

//         let conversation__date = document.createElement('span');
//         conversation__date.setAttribute('class', 'conversation__date conversation__date_viewed');
//         conversation__date.textContent = formatedDate(date);
        
//         let conversation__message = document.createElement('p');
//         conversation__message.setAttribute('class', 'conversation__message');

//         message = typeof(message) === 'string' ? message : message.body
//         conversation__message.textContent = message;

//         conversation.append(conversation__wrap);
//         conversation__wrap.append(conversation__header);

//         conversation__header.append(conversation__user);
//         conversation__user.append(img);
//         conversation__user.append(conversation__name);
//         conversation__header.append(conversation__date);
//         conversation__wrap.append(conversation__message);
        
//         return conversation;
//     }
// }

function getHash(email) {
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

async function SendgetThreadMessagesRequest(threadId) {
    return await fetch('https://geekhub-frontend-js-9.herokuapp.com/api/threads/messages/'+threadId, {
        method: 'get',
        headers:{
            'x-access-token': localStorage.token,
            'Content-Type': 'application/json'
        }
    })
    .then((resp)=> { return resp })
}
