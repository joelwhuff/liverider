export default class Login {
    constructor(parent, app) {
        this.parent = parent;

        this.app = app;

        this.container = null;
    }

    submitName(name) {
        this.app.ws.send(JSON.stringify({ type: 'name', data: name || '' }));
    }

    render() {
        this.container = document.createElement('div');
        this.container.classList.add('login');

        let logo = document.createElement('h1');
        logo.textContent = 'LiveRider Test v0.0.1';

        let input = document.createElement('input');
        input.setAttribute('spellcheck', false);
        input.setAttribute('placeholder', 'name');
        input.setAttribute('maxlength', 8);
        input.addEventListener('keyup', e => {
            if (e.key === 'Enter') {
                this.submitName(input.value);
                input.value = '';
            }
        });

        let button = document.createElement('button');
        button.textContent = 'connect';
        button.onclick = () => {
            this.submitName(input.value);
            input.value = '';
        };

        this.container.append(logo, input, button);
        this.parent.appendChild(this.container);

        input.focus();
    }

    destroy() {
        if (this.container) {
            this.parent.removeChild(this.container);
            this.container = null;
        }
    }
}
