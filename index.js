// global objects
/**
 * @typedef {Object} TaskContent
 * @property {Date} date
 * @property {string} content
 * @property {string} title
 * @property {TaskCategory} category
 * 
 * @typedef {Object} TaskCategory
 * @property {string} name
 * @property {TaskCategory|null} subCategory
 * @property {TaskContent[]|null} tasks
 */

localStorage.setItem('tasks', JSON.stringify([{ name: '默认分类', tasks: [{ date: new Date(), content: '123',title:'todo' }] }]));



class DocumentModifier{
    /**
     * 
     * @param {Document} doc 
     */
    constructor(doc) {
        this.doc = doc;
        this._listNode = this.doc.querySelector('.list-content');
        this._categoryNode = this.doc.querySelector('.category-container');
        this._contentNode = this.doc.querySelector('.content-container');
        this._currentCategory = null;
        this._currentTask = null;
    }

    get listNode() {
        if (!this._listNode) {
            this._listNode=this.doc.querySelector('.list-content');
        }
        return this._listNode;
    }

    get categoryNode() {
        if (!this._categoryNode) {
            this._categoryNode=this.doc.querySelector('.category-container');
        }
        return this._categoryNode;
    }

    get contentNode() {
        if (!this._contentNode) {
            this._contentNode=this.doc.querySelector('.content-container');
        }
        return this._contentNode;
    }

    get currentCategory() {
        return this._currentCategory;
    }

    get currentTask() {
        return this._currentTask;
    }

    /**
     * @param {TaskContent} content
     */
    addTask(content) {
        // attach new category's content.
        const node = this.doc.createElement('li');
        node.innerText = content.title;
        node.addEventListener('click', () => {
            this.refreshContent(content);
            this._currentTask = content;
        });
        node.className = 'item';
        this.listNode.appendChild(node);
    }

    /**
     * 
     * @param {TaskCategory} category 
     */
    addCategory(category) {
        const node = this.doc.createElement('li');
        node.innerText = category.name;
        node.addEventListener('click', () => {
            this.refreshList(category);
            this._currentCategory = category;
        });
        node.className = 'item';
        this.categoryNode.appendChild(node);
    }

    /**
     * @private
     * @param {TaskContent} content 
     */
    refreshContent(content) {
        this.clearContent();
        this.showContent(content);
    }

    /**
     * @private
     * @param {TaskCategory} category 
     */
    refreshList(category) {
        this.clearList();
        this.clearContent();
        category.tasks = category.tasks.sort((a, b) => a.date.getTime() - b.date.getTime());
        category.tasks.forEach(item => {
            this.addTask(item);
        })
    }

    /**
     * @public
     * @param {TaskCategory[]} tasks 
     */
    refreshCategory(tasks) {
        this.clearList();
        this.clearContent();
        this.clearCategory();
        tasks.forEach(item => {
            this.addCategory(item);
        });
    }

    clearCategory() {
        this.categoryNode.childNodes.forEach(value => value.remove());
    }

    clearList() {
        this.listNode.childNodes.forEach(value => value.remove());
    }

    clearContent() {
        // TODO: finish clear content view
    }

    /**
     * 
     * @param {TaskContent} content 
     */
    beginEditMode(content) {
        this.showContent(content);
        const titleNode = this.doc.querySelector('.content-container .title-content');
        const outlineNode = this.doc.querySelector('.content-container .outline-content');
        const contentNode = this.doc.querySelector('.content-container .content-content');
    }

    /**
     * 
     * @param {TaskContent} content 
     */
    showContent(content) {
        const titleNode = this.doc.querySelector('.content-container .title-content');
        const outlineNode = this.doc.querySelector('.content-container .outline-content');
        const contentNode = this.doc.querySelector('.content-container .content-content');
        titleNode.value = content.title;
        outlineNode.value = content.date.toLocaleDateString();
        contentNode.value = content.content;
    }
}

/**
 * @type {TaskCategory[]}
 */
const tasks = JSON.parse(localStorage.getItem('tasks'));
tasks.forEach(item => item.tasks.forEach(value => value.date = new Date(value.date)));
function initialize() {
    modifier.refreshCategory(tasks);
}
const modifier = new DocumentModifier(document);

function addCategory() {
    const categoryName = prompt('Input category name:');
    if (!categoryName) return;
    const category = createCategory(categoryName);
    modifier.addCategory(category);
}

function addTask() {
    const task = createTask();
    modifier.showContent(task);
}

/**
* @param {string} name 
* @returns {TaskCategory}
*/
function createCategory(name) {
    return {
        name: name,
        subCategory: [],
        tasks: [],
    };
}


/**
 * 
 * @returns {TaskContent}
 */
function createTask() {
    return {
        title: '',
        content: '',
        date: new Date(),
    }
}
