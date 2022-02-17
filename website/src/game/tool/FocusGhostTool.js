import { FOCUS_GHOST_SVG } from '../constant/ToolConstants.js';
import Tool from './Tool.js';
import * as KeyCode from '../keyboard/KeyCode.js';
import Control from '../keyboard/Control.js';
import Keyboard from '../keyboard/Keyboard.js';

export default class FocusGhostTool extends Tool {
    static get toolName() {
        return 'Focus ghost';
    }
    static get keyLabel() {
        return 'Control+G';
    }
    static get key() {
        return new Control(KeyCode.DOM_VK_G, Keyboard.CTRL);
    }
    static get icon() {
        return FOCUS_GHOST_SVG;
    }

    constructor(track) {
        super(track);

        this.currentGhostIndex = 0;
    }

    run() {
        if (this.track.socketRunners.size) {
            this.currentGhostIndex = (this.currentGhostIndex + 1) % this.track.socketRunners.size;
            this.track.focalPoint = [...this.track.socketRunners.values()][this.currentGhostIndex].instance.hitbox;
        }
    }
}
