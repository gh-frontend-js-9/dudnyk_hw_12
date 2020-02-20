import {md5} from 'pure-md5';

export default class ProfileBlock {
    constructor (root){
        this.root = root;
    }
    createBlock(obj) {
        while (this.root.firstChild) {
            this.root.removeChild(this.root.firstChild);
        }
        
        let img = document.createElement('img');
        let hash = md5(obj.email.toLowerCase());
        img.setAttribute('class', 'profile-container__user-photo');
        img.setAttribute('src', 'https://www.gravatar.com/avatar/' + hash + '?s:60&d=wavatar')

        let titleAndPositionBox = this.createBox([{
            classes: ['profile-container__name'],
            value: obj.name
        }, 
        {
            classes: ['profile-container__profession'],
            value: obj.position
        }]);

        let aboutBox = document.createElement('p');
        aboutBox.setAttribute('class', 'profile-container__about');
        aboutBox.textContent = obj.description;

        let emailBox = this.createBox([
            {
                classes: ['profile-container__title'],
                value: 'Email'
            },
            {
                classes: ['profile-container__value'],
                value: obj.email
            }   
        ])

        let phoneBox = this.createBox([
            {
                classes: ['profile-container__title'],
                value: 'Phone'
            }, 
            {
                classes: ['profile-container__value'],
                value: obj.phone
            }
        ])

        let addressBox = this.createBox([
            {
                classes: ['profile-container__title'],
                value: 'Address'
            }, 
            {
                classes: ['profile-container__value'],
                value: obj.address
            }
        ])

        let organizationBox = this.createBox([
            {
                classes: ['profile-container__title'],
                value: 'Organization'
            }, 
            {
                classes: ['profile-container__value'],
                value: obj.organization
            }
        ])
        this.root.append(img, titleAndPositionBox, aboutBox, emailBox, phoneBox, addressBox, organizationBox)
    }
    
    createBox(arr) {
        let box = document.createElement('div');
        box.setAttribute('class', 'profile-container__box')
        arr.forEach(( {classes , value} ) => {
            let span = document.createElement('span');
            classes.forEach((el) => {span.classList.add(el)});
            span.textContent = value;
            box.append(span);
        })
        return box;
    }
}