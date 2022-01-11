import Track from '../track/Track.js';
import Tool from './Tool.js';
import EmptyTool from './EmptyTool.js';

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

        let groupEl = document.createElement('div');
        groupEl.classList.add('toolbar-group');
        for (let tool of this.tools) {
            if (tool === EmptyTool) {
                el.appendChild(groupEl);
                groupEl = document.createElement('div');
                groupEl.classList.add('toolbar-group');
            } else {
                groupEl.appendChild(this.instances[tool.toolName].getDOM());
            }
        }
        el.appendChild(groupEl);

        return el;
    }
}
