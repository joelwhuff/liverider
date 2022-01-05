import './style.css';

import Application from './app/Application.js';

let bootApp = () => {
    let app = new Application();
    app.boot();
};

window.addEventListener('load', bootApp);
