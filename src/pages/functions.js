export function createNewElement(el, value = '', classes = []) {
    let element = document.createElement(el);
    element.textContent = value;

    for(let i = 0; i < classes.length; i++) {
        element.classList.add(classes[i])
    }

    return element;
}

export function removeChildrens(root) {
    while(root.firstChild) {
        root.removeChild(root.firstChild);
    }
}