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

    createForm(obj, chatContainer) {
        
        let form = document.createElement('form');
        form.setAttribute('class', 'chat__send-block');
        
        let textarea = document.createElement('textarea');
        textarea.setAttribute('class', 'chat__textarea');
        textarea.placeholder = 'Write a message...';
        textarea.name = 'message-text';
        textarea.rows = 2;
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
                    console.log(resp)
                    let me  = obj.users.find((obj) => {if(obj['_id' === localStorage.myId]) return obj})
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
    
    return await fetch('https://geekhub-frontend-js-9.herokuapp.com/api/threads/messages', {
        method: 'post',
        headers: {
            'x-access-token': localStorage.token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })
    .then((resp) => {
        return resp;
    })
}
