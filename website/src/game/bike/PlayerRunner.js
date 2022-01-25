import Control from '../keyboard/Control.js';
import * as KeyCode from '../keyboard/KeyCode.js';
import GhostParser from '../parser/GhostParser.js';
import BikeRunner from './BikeRunner.js';
import BikeRenderer from './instance/renderer/BikeRenderer.js';
import Keyboard from '../keyboard/Keyboard.js';

export default class PlayerRunner extends BikeRunner {
    static get type() {
        return 'player';
    }

    constructor(track, bikeClass, color) {
        super(track, bikeClass, color);

        this.track.event.keyboard.registerControl('Up', new Control(KeyCode.DOM_VK_UP));
        this.track.event.keyboard.registerControl('Down', new Control(KeyCode.DOM_VK_DOWN));
        this.track.event.keyboard.registerControl('Left', new Control(KeyCode.DOM_VK_LEFT));
        this.track.event.keyboard.registerControl('Right', new Control(KeyCode.DOM_VK_RIGHT));
        this.track.event.keyboard.registerControl('Z', new Control(KeyCode.DOM_VK_Z, Keyboard.NONE, true));
    }

    onHitTarget() {
        if (this.targetsReached.size >= this.track.targets.size) {
            // let ghostString = GhostParser.generate(this);
            // console.log(ghostString);
            this.finished = true;
            this.finalTime = this.track.time;
        }
    }

    onHitCheckpoint() {
        this.save();
        this.track.ghostRunners.forEach(runner => {
            runner.save();
        });
    }

    updateControls() {
        let controls = new Map();
        controls.set('upPressed', this.track.event.keyboard.isDown('Up'));
        controls.set('downPressed', this.track.event.keyboard.isDown('Down'));
        controls.set('leftPressed', this.track.event.keyboard.isDown('Left'));
        controls.set('rightPressed', this.track.event.keyboard.isDown('Right'));
        controls.set('turnPressed', this.track.event.keyboard.isDown('Z'));

        let i = 0;
        controls.forEach((pressed, mapKey) => {
            // this[mapKey] refers to the this.xxxPressed properties of BikeRunner
            if (pressed !== this[mapKey]) {
                this.track.room.sendBuffer([0, i, this.track.time]);

                // this.instance.keyLog.get(mapKey).push(this.track.time.toString());
                this[mapKey] = pressed;
            }
            ++i;
        });

        if ([...controls.values()].some(Boolean)) {
            this.track.focalPoint = this.instance.hitbox;
            this.track.toolManager.active = false;
        }
    }

    renderInstance(ctx) {
        BikeRenderer.render(ctx, this.instance, 1);

        if (this.track.paused) {
            let bikePos = this.instance.backWheel.displayPos
                .add(this.instance.frontWheel.displayPos)
                .add(this.instance.hitbox.displayPos)
                .scale(1 / 3)
                .toPixel(this.track);

            ctx.save();
            ctx.font = `bold ${Math.min(25 * this.track.zoomFactor, 15)}px Ubuntu`;

            let text = 'paused';

            let textMetrics = ctx.measureText(text);
            let textWidth = textMetrics.width;
            ctx.fillStyle = '#000';

            let textX = bikePos.x - textWidth / 2;
            let textY = bikePos.y - this.instance.hitbox.size * 4 * this.track.zoomFactor;

            ctx.fillText(text, textX, textY);
            ctx.restore();
        }
    }
}
