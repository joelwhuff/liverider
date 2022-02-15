import { RESTART_SVG } from '../constant/ToolConstants.js';
import Tool from './Tool.js';
import * as KeyCode from '../keyboard/KeyCode.js';
import Control from '../keyboard/Control.js';

export default class RestartTool extends Tool {
    static get toolName() {
        return 'Restart';
    }
    static get keyLabel() {
        return 'Enter';
    }
    static get key() {
        return new Control(KeyCode.DOM_VK_RETURN);
    }
    static get icon() {
        return RESTART_SVG;
    }

    run() {
        this.track.room.sendFloat64Array([0, 5, this.track.time]);
        this.track.restart();
    }
}
