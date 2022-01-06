import { makeSVGElement } from '../../util/DOM.js';
import { PAUSE_SVG, PLAY_SVG } from '../constant/ToolConstants.js';
import Tool from './Tool.js';
import * as KeyCode from '../keyboard/KeyCode.js';
import Control from '../keyboard/Control.js';

export default class PauseTool extends Tool {
    static get toolName() {
        return 'Pause';
    }
    static get keyLabel() {
        return 'Space';
    }
    static get key() {
        return new Control(KeyCode.DOM_VK_SPACE);
    }
    static get icon() {
        return PAUSE_SVG;
    }

    constructor(track) {
        super(track);

        let svg = makeSVGElement('svg', null, {
            'xmlns': 'http://www.w3.org/2000/svg',
            'viewBox': '0 0 24 24',
            'width': '24',
            'height': '24',
        });

        for (let element in PLAY_SVG) {
            makeSVGElement(element, svg, PLAY_SVG[element]);
        }

        this.unpauseIcon = svg;
    }

    run() {
        this.track.paused = !this.track.paused;
        this.updateDOM();
    }

    updateDOM() {
        this.dom.title = `${this.track.paused ? 'Unpause' : this.constructor.toolName} (${this.constructor.keyLabel})`;
        let domReplace = this.track.paused ? [this.unpauseIcon, this.domIcon] : [this.domIcon, this.unpauseIcon];
        try {
            this.dom.replaceChild(domReplace[0], domReplace[1]);
        } catch (e) {
            /* Don't do anything if the pause variable has been handled elsewhere */
        }
    }
}
