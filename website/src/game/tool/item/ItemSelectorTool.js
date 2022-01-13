import { ITEMS_SVG } from '../../constant/ToolConstants.js';
import * as KeyCode from '../../keyboard/KeyCode.js';
import Control from '../../keyboard/Control.js';
import Tool from './../Tool.js';
import { ITEM_OPTIONS } from '../../constant/ToolbarConstants.js';

export default class ItemSelectorTool extends Tool {
    static get toolName() {
        return 'Items';
    }
    static get keyLabel() {
        return 'I';
    }
    static get key() {
        return new Control(KeyCode.DOM_VK_I);
    }
    static get icon() {
        return ITEMS_SVG;
    }

    constructor(track) {
        super(track);

        this.makeOptions();
    }

    run() {
        this.track.toolManager.itemSelector = this;
        this.dom.classList.add('selected');

        this.showOptions();

        this.track.toolCollection.getByToolName('Target').run();
    }

    deactivate() {
        this.track.canvas.parentElement.removeChild(this.optionsEl);
        this.dom.classList.remove('selected');
        this.track.toolManager.itemSelector = null;
    }

    makeOptions() {
        this.optionsEl = document.createElement('div');
        this.optionsEl.id = 'tool-options';

        ITEM_OPTIONS.forEach(itemClass => {
            let tool = new itemClass(this.track);
            tool.registerControls();
            this.track.toolCollection.setTool(tool);

            let toolDOM = tool.getDOM();
            toolDOM.classList.add('option', 'item');
            this.optionsEl.appendChild(toolDOM);
        });
    }
}
