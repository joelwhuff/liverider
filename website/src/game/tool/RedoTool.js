import { REDO_SVG } from '../constant/ToolConstants.js';
import Tool from './Tool.js';
import * as KeyCode from '../keyboard/KeyCode.js';
import Control from '../keyboard/Control.js';
import Keyboard from '../keyboard/Keyboard.js';

export default class RedoTool extends Tool {
    static get toolName() {
        return 'Redo';
    }
    static get keyLabel() {
        return 'N';
    }
    static get key() {
        return new Control(KeyCode.DOM_VK_Y, Keyboard.CTRL);
    }
    static get icon() {
        return REDO_SVG;
    }

    run() {
        this.track.undoManager.redo();
    }
}
