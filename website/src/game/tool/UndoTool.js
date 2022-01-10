import { UNDO_SVG } from '../constant/ToolConstants.js';
import Tool from './Tool.js';
import * as KeyCode from '../keyboard/KeyCode.js';
import Control from '../keyboard/Control.js';
import Keyboard from '../keyboard/Keyboard.js';

export default class UndoTool extends Tool {
    static get toolName() {
        return 'Undo';
    }
    static get keyLabel() {
        return 'Control+Z';
    }
    static get key() {
        return new Control(KeyCode.DOM_VK_Z, Keyboard.CTRL);
    }
    static get icon() {
        return UNDO_SVG;
    }

    run() {
        this.track.undoManager.undo();
    }
}
