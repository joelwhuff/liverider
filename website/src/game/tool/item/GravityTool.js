import { GRAVITY_SVG } from '../../constant/ToolConstants.js';
import DirectionalItemTool from './DirectionalItemTool.js';
import Gravity from '../../item/directional/Gravity.js';
import Keyboard from '../../keyboard/Keyboard.js';
import Control from '../../keyboard/Control.js';
import * as KeyCode from '../../keyboard/KeyCode.js';

export default class GravityTool extends DirectionalItemTool {
    static get toolName() {
        return 'Gravity';
    }
    static get keyLabel() {
        return '4';
    }
    static get key() {
        return new Control(KeyCode.DOM_VK_4);
    }
    static get icon() {
        return GRAVITY_SVG;
    }
    static get itemClass() {
        return Gravity;
    }
}
