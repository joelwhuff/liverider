import './index.css';

import Application from './app/Application.js';

let app = null;

let bootApp = () => {
    app = new Application();
    app.boot();
};

window.addEventListener('load', bootApp);
