import { BOOST_SVG } from '../../constant/ToolConstants.js';
import DirectionalItemTool from './DirectionalItemTool.js';
import Boost from '../../item/directional/Boost.js';
import Keyboard from '../../keyboard/Keyboard.js';
import Control from '../../keyboard/Control.js';
import * as KeyCode from '../../keyboard/KeyCode.js';

export default class BoostTool extends DirectionalItemTool {
    static get toolName() {
        return 'Boost';
    }
    static get keyLabel() {
        return '3';
    }
    static get key() {
        return new Control(KeyCode.DOM_VK_3);
    }
    static get icon() {
        return BOOST_SVG;
    }
    static get itemClass() {
        return Boost;
    }
}
