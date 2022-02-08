import { SWITCH_MAP } from '../constant/BikeConstants.js';
import BikeRunner from './BikeRunner.js';
import BikeRenderer from './instance/renderer/BikeRenderer.js';

export default class SocketRunner extends BikeRunner {
    constructor(track, bikeClass, name, color) {
        super(track, bikeClass, name, color);

        this.time = 0;
        this.paused = false;

        this.keys = new Map();
        this.keys.set('upPressed', new Array());
        this.keys.set('downPressed', new Array());
        this.keys.set('leftPressed', new Array());
        this.keys.set('rightPressed', new Array());
        this.keys.set('turnPressed', new Array());

        this.restartPressed = new Array();
        this.cancelPressed = new Array();
        this.pausePressed = new Array();
        this.unpausePressed = new Array();
        this.switchBikePressed = new Array();
    }

    // todo
    // fix pressing keys before parser is done error
    // add queue for toolControls
    // think about what happens when multiple frames are dropped

    onHitTarget() {
        if (this.targetsReached.size >= this.track.targets.size) {
            this.done = true;
            this.finalTime = this.time;
        }
    }

    onHitCheckpoint() {
        super.save();
    }

    runUpdates(time) {
        this.upPressed = false;
        this.downPressed = false;
        this.leftPressed = false;
        this.rightPressed = false;
        this.turnPressed = false;

        this.time = 0;

        this.bikeClass = this.track.bikeClass;
        super.createBike();
        super.reset();
        this.restart();

        while (this.time < time) {
            this.fixedUpdate();
        }
    }

    fixedUpdate() {
        this.updateToolControls();
        if (!this.paused) {
            super.fixedUpdate();
        }
        ++this.time;
    }

    restart() {
        this.paused = false;
        super.restart();
    }

    updateControls() {
        this.keys.forEach((keyArray, mapKey) => {
            if (keyArray.includes(this.time)) {
                this[mapKey] = !this[mapKey];
            }
        });
    }

    updateToolControls() {
        // at some point make a toolupdate queue, updateToolControls will run the tools in the proper
        // order they were pressed, in case pause and restart are pressed on same track time, it would
        // be handled accurately
        // perhaps queue for everything for simplicity

        if (this.restartPressed.includes(this.time)) {
            this.restart();
        }
        if (this.cancelPressed.includes(this.time)) {
            super.popCheckpoint();
            this.restart();
        }
        if (this.pausePressed.includes(this.time)) {
            this.paused = true;
        }
        if (this.unpausePressed.includes(this.time)) {
            this.paused = false;
        }
        if (this.switchBikePressed.includes(this.time)) {
            this.bikeClass = SWITCH_MAP[this.bikeClass.bikeName];
            super.createBike();
            super.reset();
            this.restart();
        }
    }

    startFrom(snapshot) {
        this.done = false;
        this.dead = false;
        this.deadObject = null;

        let bike = this.initialBike;
        this.targetsReached = new Map();
        this.checkpointsReached = new Map();

        // this.upPressed = false;
        // this.downPressed = false;
        // this.leftPressed = false;
        // this.rightPressed = false;
        // this.turnPressed = false;

        if (snapshot) {
            bike = snapshot.bike;
            this.targetsReached = new Map(snapshot.targetsReached);
            this.checkpointsReached = new Map(snapshot.checkpointsReached);

            // this.upPressed = snapshot.upPressed;
            // this.downPressed = snapshot.downPressed;
            // this.leftPressed = snapshot.leftPressed;
            // this.rightPressed = snapshot.rightPressed;
            // this.turnPressed = snapshot.turnPressed;
        }

        this.instance = bike.clone();
    }

    /**
     *
     * @param {CanvasRenderingContext2D} ctx
     */
    renderInstance(ctx) {
        BikeRenderer.render(ctx, this.instance, 1);

        let bikePos = this.instance.backWheel.displayPos
            .add(this.instance.frontWheel.displayPos)
            .add(this.instance.hitbox.displayPos)
            .scale(1 / 3)
            .toPixel(this.track);

        ctx.save();
        ctx.font = `bold ${Math.min(25 * this.track.zoomFactor, 15)}px Ubuntu`;

        let text = this.name + (this.paused ? ' (paused)' : '');

        let nameMetrics = ctx.measureText(text);
        let nameWidth = nameMetrics.width;
        ctx.fillStyle = this.instance.color;

        let nameX = bikePos.x - nameWidth / 2;
        let nameY = bikePos.y - this.instance.hitbox.size * 4 * this.track.zoomFactor;

        ctx.fillText(text, nameX, nameY);
        ctx.restore();
    }

    parseKeyPress(key, time) {
        // this[0] = new Array()
        switch (key) {
            case 0:
                this.keys.get('upPressed').push(time);
                break;
            case 1:
                this.keys.get('downPressed').push(time);
                break;
            case 2:
                this.keys.get('leftPressed').push(time);
                break;
            case 3:
                this.keys.get('rightPressed').push(time);
                break;
            case 4:
                this.keys.get('turnPressed').push(time);
                break;
            case 5:
                this.restartPressed.push(time);
                break;
            case 6:
                this.cancelPressed.push(time);
                break;
            case 7:
                this.pausePressed.push(time);
                break;
            case 8:
                this.unpausePressed.push(time);
                break;
            case 9:
                this.switchBikePressed.push(time);
                break;
        }

        if (time < this.time) {
            this.runUpdates(this.time - 2);
        }
    }
}
