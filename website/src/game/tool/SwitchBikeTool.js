import { SWITCH_MAP } from '../constant/BikeConstants.js';
import { SWITCH_BIKE_SVG } from '../constant/ToolConstants.js';
import Tool from './Tool.js';
import * as KeyCode from '../keyboard/KeyCode.js';
import Control from '../keyboard/Control.js';
import StartPositionTool from './StartPositionTool.js';

export default class SwitchBikeTool extends Tool {
    static get toolName() {
        return 'Switch Bike';
    }
    static get keyLabel() {
        return 'B';
    }
    static get key() {
        return new Control(KeyCode.DOM_VK_B);
    }
    static get icon() {
        return SWITCH_BIKE_SVG;
    }

    run() {
        this.track.playerRunner.bikeClass = SWITCH_MAP[this.track.playerRunner.bikeClass.bikeName];
        this.track.playerRunner.createBike();
        this.track.playerRunner.reset();
        this.track.ghostRunners.forEach(runner => {
            runner.reset();
        });

        this.track.restart();

        this.track.toolCollection.getByToolName(StartPositionTool.toolName).createDummyRunner();
    }
}
