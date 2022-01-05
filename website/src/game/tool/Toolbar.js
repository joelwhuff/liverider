import Track from '../track/Track.js';
import Tool from './Tool.js';

export default class Toolbar {
    /**
     *
     * @param {Tool[]} tools
     * @param {Tool[]} instances
     */
    constructor(tools, instances) {
        this.tools = tools;
        this.instances = instances;
    }

    registerControls() {
        for (let tool in this.instances) {
            this.instances[tool].registerControls();
        }
    }

    /** @param {Track} track */
    attachToTrack(track) {
        track.toolCollection.setTools(this.instances);
    }

    /**
     * @returns {Element}
     */
    getDOM() {
        let el = document.createElement('div');
        el.classList.add('toolbar');

        for (let tool in this.tools) {
            el.appendChild(this.instances[this.tools[tool].toolName].getDOM());
        }

        return el;
    }
}
