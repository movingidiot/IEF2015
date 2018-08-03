class View{
    /**
     * 
     * @param {*} model model to bind, ATTENTION: to show model's value, override model.toString()
     * @param {string} tagName
     */
    constructor(model, tagName) {
        this._model = model;
        this.modelProxy = new Proxy(modelProxy, {
            get: this._getter,
            set: this._setter,
        });
        this._getDelegation = [];
        this._setDelegation = [];
        Object.assign(this, this.modelProxy);
        this.HTMLElement = document.createElement(tagName);
        this.HTMLElement.innerText = model.toString();
    }

    _getter(target, propertyName) {
        return target[propertyName];
    }

    _setter(target, propertyName,value) {
        target[propertyName] = value;
        this.HTMLElement.innerText = value.toString();
    }

    onGet(callback) {
        this._getDelegation.push(callback);
    }

}

class ButtonView extends View{
    /**
     * 
     * @param {string} text button's inner text
     * @param {HTMLElement} parentNode button node's parent node
     */
    constructor(text,parentNode) {
        super(text, 'button');
        parentNode.appendChild(this.HTMLElement);
    }

}

class ListView extends View{
    /**
     * 
     * @param {any[]} list 
     * @param {HTMLElement} parentNode 
     * @param {ButtonView} dependingOn 
     */
    constructor(list, parentNode,dependingOn) {
        super(list, 'ul');
        parentNode.appendChild(this.HTMLElement);
        dependingOn.HTMLElement.addEventListener('click', ev => {
            this.fetchView();
        });
    }

    fetchView() {
        this.HTMLElement.childNodes.forEach(child => child.remove());
        this._model.forEach(item => {
            const child = new ListItemView(item);
            this.HTMLElement.appendChild(child);
            
        });
    }
}

class ListItemView extends View{
    constructor(model) {
        super(model, 'li');
    }
}