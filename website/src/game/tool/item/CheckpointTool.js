import { CHECKPOINT_SVG } from '../../constant/ToolConstants.js';
import Checkpoint from '../../item/reachable/Checkpoint.js';
import ItemTool from './ItemTool.js';
import Keyboard from '../../keyboard/Keyboard.js';
import Control from '../../keyboard/Control.js';
import * as KeyCode from '../../keyboard/KeyCode.js';

export default class CheckpointTool extends ItemTool {
    static get toolName() {
        return 'Checkpoint';
    }
    static get keyLabel() {
        return '2';
    }
    static get key() {
        return new Control(KeyCode.DOM_VK_2);
    }
    static get icon() {
        return CHECKPOINT_SVG;
    }
    static get itemClass() {
        return Checkpoint;
    }
}
