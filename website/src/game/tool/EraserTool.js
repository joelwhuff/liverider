import { ERASER_SVG, SOLID_SVG, SCENERY_SVG, ITEMS_SVG } from '../constant/ToolConstants.js';
import Control from '../keyboard/Control.js';
import * as KeyCode from '../keyboard/KeyCode.js';
import Tool from './Tool.js';

export default class EraserTool extends Tool {
    static get toolName() {
        return 'Eraser';
    }
    static get keyLabel() {
        return 'E';
    }
    static get key() {
        return new Control(KeyCode.DOM_VK_E);
    }
    static get icon() {
        return ERASER_SVG;
    }

    constructor(track) {
        super(track);

        this.size = 22;
        this.minSize = 2;
        this.maxSize = 62;

        this.restrict = new Map();
        this.restrict.set('line', true);
        this.restrict.set('scenery', true);
        this.restrict.set('object', true);

        this.makeOptions();
    }

    onMouseDown(e) {
        super.onMouseDown(e);
        this.onMouseMove(e);
    }

    onMouseMove(e) {
        super.onMouseMove(e);
        if (this.mouseDown) {
            let deleted = this.track.checkDelete(this.track.mousePos, this.size, this.restrict);
            if (deleted.length) {
                this.track.undoManager.push({
                    undo: () => deleted.forEach(e => e.addToTrack()),
                    redo: () => deleted.forEach(e => e.removeFromTrack()),
                });
            }
        }
    }

    onScroll(e) {
        if (this.isHolding()) {
            this.size = Math.max(this.minSize, Math.min(this.maxSize, this.size + 4 * -Math.sign(e.deltaY)));
        } else {
            super.onScroll(e);
        }
    }

    makeOptions() {
        this.optionsEl = document.createElement('div');
        this.optionsEl.id = 'tool-options';

        let solid = document.createElement('div');
        solid.classList.add('tool', 'option');
        solid.innerHTML = SOLID_SVG;

        let scenery = document.createElement('div');
        scenery.classList.add('tool', 'option');
        scenery.innerHTML = SCENERY_SVG;

        let items = document.createElement('div');
        items.classList.add('tool', 'option');
        items.innerHTML = ITEMS_SVG;

        let toggleSolid = () => {
            if (this.restrict.get('line')) {
                this.restrict.set('line', false);
                solid.classList.remove('selected');
            } else {
                this.restrict.set('line', true);
                solid.classList.add('selected');
            }
        };
        let toggleScenery = () => {
            if (this.restrict.get('scenery')) {
                this.restrict.set('scenery', false);
                scenery.classList.remove('selected');
            } else {
                this.restrict.set('scenery', true);
                scenery.classList.add('selected');
            }
        };
        let toggleItems = () => {
            if (this.restrict.get('object')) {
                this.restrict.set('object', false);
                items.classList.remove('selected');
            } else {
                this.restrict.set('object', true);
                items.classList.add('selected');
            }
        };

        this.restrict.get('line') && solid.classList.add('selected');
        this.restrict.get('scenery') && scenery.classList.add('selected');
        this.restrict.get('object') && items.classList.add('selected');

        solid.addEventListener('click', toggleSolid);
        scenery.addEventListener('click', toggleScenery);
        items.addEventListener('click', toggleItems);

        this.optionsEl.append(solid, scenery, items);
    }

    render(ctx) {
        let pos = this.track.mousePos.toPixel(this.track);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, this.size * this.track.zoomFactor, 0, 2 * Math.PI, true);
        ctx.fillStyle = 'rgba(0,0,0,0.18)';
        ctx.fill();
    }
}
