import { GAME_UPS } from './constant/GameConstants.js';
import Application from '../app/Application.js';
import GeneratorState from './state/GeneratorState.js';
import ParserState from './state/ParserState.js';
import StateManager from './state/StateManager.js';
import TrackState from './state/TrackState.js';
import UI from './ui/UI.js';

export default class Game {
    /**
     *
     * @param {HTMLElement} container
     * @param {{}} opt
     */
    constructor(container, opt) {
        this.user = opt.user || { name: 'me', color: '#000' };

        this.ui = new UI(this, container);

        /** @type {StateManager} */
        this.stateManager = new StateManager(this, this.ui.canvas, { ...opt, user: this.user });
        this.stateManager.addState(ParserState, 'parser');
        this.stateManager.addState(TrackState, 'track');
        this.stateManager.addState(GeneratorState, 'generator');

        /** @type {CanvasRenderingContext2D} */
        this.ctx = this.ui.canvas.getContext('2d');

        /** @type {number} */
        this.lastTime = performance.now();
        /** @type {number} */
        this.timer = performance.now();
        /** @type {number} */
        this.frameDuration = 1000 / GAME_UPS;
        /** @type {number} */
        this.progress = 0;
        /** @type {number} */
        this.frames = 0;
        /** @type {number} */
        this.updates = 0;
    }

    setContextProperties() {
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.font = 'bold 15px Ubuntu';
        this.ctx.imageSmoothingEnabled = false;
    }

    setCanvasSize() {
        this.ui.canvas.width = this.ui.canvas.parentElement.clientWidth;
        this.ui.canvas.height = this.ui.canvas.parentElement.clientHeight;

        this.setContextProperties();
    }

    run() {
        requestAnimationFrame(() => this.run());

        let now = performance.now();
        let delta = now - this.lastTime;

        // delta must be accurate for live racing
        // if (delta > 1000) {
        //     delta = this.frameDuration;
        // }

        this.progress += delta / this.frameDuration;
        this.lastTime = now;

        while (this.progress >= 1) {
            this.stateManager.fixedUpdate();
            this.updates++;
            this.progress--;
        }

        this.stateManager.update(this.progress, delta);

        if (
            this.ui.canvas.width !== this.ui.canvas.parentElement.clientWidth ||
            this.ui.canvas.height !== this.ui.canvas.parentElement.clientHeight
        ) {
            this.setCanvasSize();
        }

        this.stateManager.render(this.ctx);
        this.frames++;

        if (performance.now() - this.timer > 1000) {
            this.timer = performance.now();

            this.updates = 0;
            this.frames = 0;
        }
    }
}
