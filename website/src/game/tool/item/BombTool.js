import { BOMB_SVG } from '../../constant/ToolConstants.js';
import Bomb from '../../item/Bomb.js';
import ItemTool from './ItemTool.js';
import Control from '../../keyboard/Control.js';
import * as KeyCode from '../../keyboard/KeyCode.js';
import Keyboard from '../../keyboard/Keyboard.js';

export default class BombTool extends ItemTool {
    static get toolName() {
        return 'Bomb';
    }
    static get keyLabel() {
        return '5';
    }
    static get key() {
        return new Control(KeyCode.DOM_VK_5);
    }
    static get icon() {
        return BOMB_SVG;
    }
    static get itemClass() {
        return Bomb;
    }
}
