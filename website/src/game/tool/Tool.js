import { makeSVGElement } from '../../util/DOM.js';
import Track from '../track/Track.js';
import GameObject from '../GameObject.js';

export default class Tool extends GameObject {
    static get toolName() {
        return 'Tool';
    }
    static get keyLabel() {
        return null;
    }
    static get key() {
        return null;
    }
    static get icon() {
        return null;
    }

    /**
     *
     * @param {Track} track
     */
    constructor(track) {
        super();
        this.track = track;
        this.mouseDown = false;
        this.alwaysRender = false;

        this.optionsEl = null;
    }

    registerControls() {
        if (this.constructor.keyLabel != null && this.constructor.key != null) {
            this.track.event.keyboard.registerControl(this.constructor.keyLabel, this.constructor.key);
        }
    }

    getDOM() {
        let el = document.createElement('div');
        el.classList.add('tool');
        el.title = `${this.constructor.toolName} (${this.constructor.keyLabel})`;

        if (this.constructor.icon) {
            this.domIcon = this.constructor.icon;
            el.innerHTML = this.constructor.icon;
        }

        el.addEventListener('click', () => this.run());
        el.addEventListener('contextmenu', e => {
            e.preventDefault();
            // this.run();
        });

        this.dom = el;
        return el;
    }

    isHolding() {
        return this.track.event.keyboard.isDown(this.constructor.keyLabel);
    }

    run() {
        this.track.toolManager.setTool(this);
    }

    makeOptions() {}

    showOptions() {
        if (this.optionsEl !== null) {
            this.track.canvas.parentElement.appendChild(this.optionsEl);
        }
    }

    hideOptions() {
        if (this.optionsEl !== null) {
            this.track.canvas.parentElement.removeChild(this.optionsEl);
        }
    }

    activate() {
        this.track.canvas.style.cursor = 'default';
        this.showOptions();
    }

    deactivate() {
        this.mouseDown = false;
        this.hideOptions();
    }

    onMouseDown(e) {
        if (e.button !== 2) {
            this.mouseDown = true;
        }
    }

    onMouseUp(e) {
        this.mouseDown = false;
    }

    onMouseMove(e) {
        this.track.focalPoint = null;
    }

    onScroll(e) {
        let pos = this.track.mousePos;
        if (this.track.focalPoint) {
            pos = this.track.focalPoint.displayPos;
        }
        this.track.zoom(pos, -Math.sign(e.deltaY));
    }

    fixedUpdate() {}
    update(progress, delta) {}
    render(ctx) {}
}
