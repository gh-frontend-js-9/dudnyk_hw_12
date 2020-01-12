export default class CreatePage {
    constructor(root) {
        this.root = root;
    }

    addLogo() {
        let logo = document.createElement('img');
        logo.setAttribute('src', '/dist/images/logo/Logo.png');
        logo.setAttribute('alt', 'virtus');
        logo.setAttribute('class', 'auth-container__logo')
        return logo;
    }

    addTitle(name) {
        let title = document.createElement('h1');
        title.setAttribute('class', 'auth-container__title');
        
        title.textContent = name;
        
        return title;
    }

    addLink(text) {
        let link = document.createElement('a');
        
        link.setAttribute('href', '#');
        link.setAttribute('class', 'auth-container__link');
        link.textContent = text;

        return link;
    }

    addInput(type, name, id, cls, plholder) {
        let inp = document.createElement('input');
        
        inp.setAttribute('type', type);
        inp.setAttribute('name', name);
        inp.setAttribute('id', id);
        inp.setAttribute('class', cls);
        inp.setAttribute('placeholder', plholder)
        // inp.setAttribute('required', true)
        
        return inp;
    }

    addForm(action, method, id) {
        let form = document.createElement('form');
        
        form.setAttribute('action', action);
        form.setAttribute('method', method);
        form.setAttribute('id', id);

        return form
    }

    addSubmit(text) {
        let subm = document.createElement('button');
        
        subm.setAttribute('type', 'submit');
        subm.setAttribute('class', 'auth-container__btn');
        subm.style.alignSelf = 'center';
        subm.textContent = text;

        return subm;
    }
}