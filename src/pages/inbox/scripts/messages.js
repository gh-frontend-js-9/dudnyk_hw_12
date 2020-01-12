import {md5} from 'pure-md5';

export default class Messages {
    constructor(root) {
        this.root = root;
    }
    
    createMessagesBlock(messagesBlock, form) {
        
        while (this.root.firstChild) {
            this.root.removeChild(this.root.firstChild);
        }

        this.root.append(messagesBlock, form);
    }
    
    createChatContainer() {
        let chatContainer = document.createElement('div');
        chatContainer.setAttribute('class', 'chat__container');
        return chatContainer;
    }

    createMessage(message, obj, isMe) {
        // console.log(message)
        // console.log(obj)
        // console.log(isMe);
        let messageType = isMe ? 'to' : 'from';
        let margin = isMe ? 'mgleft' : 'mgright';

        let container = document.createElement('div');
        container.classList.add('message', 'message_' + messageType + '-someone');
        
        let content =document.createElement('div');
        content.classList.add('message__content');

        let img = document.createElement('img');
        let hash = md5(obj.email.toLowerCase());
        
        img.setAttribute('src', 'https://www.gravatar.com/avatar/' + hash + '?s=60&d=wavatar')
        img.setAttribute('alt', 'user photo');
        img.classList.add('message__user-photo', 'message_' + margin + '_5');

        let text = document.createElement('p');
        text.textContent = message.body;
        text.classList.add('message__text', 'message__text_' + messageType + '-someone');

        let date = document.createElement('span');
        
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        
        let FormatedDate = (date) => {
            date = new Date(Date.parse(date));
            return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`
        };

        date.textContent = FormatedDate(message.created_at);
        date.classList.add('message__date', 'message__date_' + messageType + '-someone');

        container.append(content, date)
        if (isMe) { content.append(text,img); }
        else { content.append(img, text); }
        return container;
    
    }

    // createToMessage(message, email) {
    //     // console.log(message);
    //     let container = document.createElement('div');
    //     container.classList.add('message', 'message_to-someone');
    //     let content =document.createElement('div');
    //     content.classList.add('message__content');

    //     let img = document.createElement('img');
    //     let hash = md5(email[0].email.toLowerCase());
    //     img.setAttribute('src', 'https://www.gravatar.com/avatar/' + hash + '?s=42&d=wavatar')
    //     img.setAttribute('alt', 'user photo');
    //     img.classList.add('message__user-photo', 'message_mgleft_5');
        
    //     let text = document.createElement('p');
    //     text.textContent = message.body;
    //     text.classList.add('message__text', 'message__text_to-someone');

    //     let date = document.createElement('span');
        
    //     const monthNames = [
    //         "January", "February", "March", "April", "May", "June",
    //         "July", "August", "September", "October", "November", "December"];
        
    //     let FormatedDate = (date) => {
    //         date = new Date(Date.parse(date));
    //         return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`
    //     };

    //     date.textContent = FormatedDate(message.created_at);
    //     date.classList.add('message__date', 'message__date_to-someone');

    //     container.append(content, date)
    //     content.append(text,img);

    //     return container;
    // }

    // createFromMessage(message, email) {
    //     let container = document.createElement('div');
    //     container.classList.add('message', 'message_from-someone');
    //     let content =document.createElement('div');
    //     content.classList.add('message__content');

    //     let img = document.createElement('img');
    //     img.classList.add('message__user-photo', 'message_mgright_5');
    
    //     let hash = md5(email[0].email.toLowerCase());
    //     img.setAttribute('src', 'https://www.gravatar.com/avatar/' + hash + '?s=42&d=wavatar')
    //     img.setAttribute('alt', 'user photo');


    //     let text = document.createElement('p');
    //     text.textContent = message.body;
    //     text.classList.add('message__text', 'message__text_from-someone');

    //     let date = document.createElement('span');
        
    //     const monthNames = [
    //         "January", "February", "March", "April", "May", "June",
    //         "July", "August", "September", "October", "November", "December"];
        
    //     let FormatedDate = (date) => {
    //         date = new Date(Date.parse(date));
    //         return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`
    //     };

    //     date.textContent = FormatedDate(message.created_at);
    //     date.classList.add('message__date', 'message__date_from-someone');

    //     container.append(content, date)
    //     content.append(img, text);

    //     return container;
    // }

    //                     <!-- <div class="message message_from-someone">
    //                         <div class="message__content">
    //                             <img src="/dist/images/usersImgs/lyall.png" alt="" class="message__user-photo message_mgright_5">
    //                             <div class="message__text message__text_from-someone">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ulla pariatur.</div>
    //                         </div>
    //                         <span class="message__date message__date_from-someone">4 April 2016, 5:32 PM</span>
    //                     </div> -->
    
// <!-- <div class="message message_to-someone">
//     <div class="message__content">
//         <div class="message__text  message__text_to-someone">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ulla pariatur.</div>
//         <img src="/dist/images/usersImgs/user.png" alt="" class="message__user-photo message_mgleft_5">
//     </div>
//     <span class="message__date message__date_to-someone">4 April 2016, 5:32 PM</span>
// </div> -->

    createTextarea(obj) {
        let textarea = document.createElement('textarea');
        textarea.setAttribute('class', 'chat__send');
        textarea.placeholder = 'Write a message...';
        textarea.name = 'message-text';
        textarea.rows = 2;
        textarea.style.resize = 'none';
        textarea.addEventListener('keypress', (e) =>{
            
            if (e.which === 13) {
                // console.log(threadId, textarea.value)
                e.preventDefault();
                SendMessage(threadId, textarea.value)
                .then((resp) => {
                
                    if(resp.status === 200) {
                        return resp.json();
                    } else {
                        throw new Error('Failed to send');
                    }
                })
                .then((resp) => {
                    // console.log(resp);
                    chatContainer.append(this.createMessage(resp, obj.users[0]));
                    textarea.value = '';
                })
                .catch((error) => {
                    console.log(error);
                });
            }

        });
    }

    createForm(obj, chatContainer) {
        
        let form = document.createElement('form');
        form.setAttribute('class', 'chat__send-block');
        
        let textarea = document.createElement('textarea');
        textarea.setAttribute('class', 'chat__send');
        textarea.placeholder = 'Write a message...';
        textarea.name = 'message-text';
        textarea.rows = 2;
        textarea.style.resize = 'none';
        textarea.addEventListener('keypress', (e) =>{
            
            if (e.which === 13) {
                console.log(obj, textarea.value)
                e.preventDefault();
                SendMessage(obj["_id"], textarea.value)
                .then((resp) => {
                
                    if(resp.status === 200) {
                        return resp.json();
                    } else {
                        throw new Error('Failed to send');
                    }
                })
                .then((resp) => {
                    let me  = obj.users.find((obj)=> {if(obj.me) return obj})
                    let message = this.createMessage(resp, me, true)
                    chatContainer.append(message);
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                    textarea.value = '';
                })
                .catch((error) => {
                    console.log(error);
                });
            }

        });
        let attachment = document.createElement('span');
        attachment.setAttribute('class', 'chat__attachment');
        form.append(textarea, attachment);
        return form;
    }

    // async getMessages(threadId) {
    //     return getThreadMessages(threadId)
    //     .then((resp) => {
    //         if (resp.status === 200) {
    //             return resp.json();
    //         } else {
    //             throw new Error('Bad response');
    //         }
    //     })
    //     .then((resp)=> {
    //         console.log(resp)
    //         return resp
    //     })
    //     .catch((error)=> {
    //         console.log(error)
    //     });
    // }

    // async createChatContainer(threadId) {
    //     let chatContainer = document.createElement('div');
    //     chatContainer.setAttribute('class', 'chat__container');
        
    //     await this.getMessages(threadId).then((resp)=> console.log(resp))
    //     // chatContainer.append(a);
    //     console.log('asd')
    //     return chatContainer;

    // }
}


async function SendMessage(id, message) {
    let obj = {
        'thread': {
            '_id': id
        },
        'message': {
            'body': message
        }
    }
    
    return await fetch('http://localhost:3000/api/threads/messages', {
        method: 'post',
        headers: {
            'Authorization': localStorage.token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })
    .then((resp) => {
        return resp;
    })
}
