export default class Login {
    constructor(app, parent) {
        this.app = app;

        this.parent = parent;

        this.container;
    }

    render() {
        let options = document.createElement('div');
    }

    destroy() {
        this.parent.removeChild(this.container);
        this.container = null;
    }
}
