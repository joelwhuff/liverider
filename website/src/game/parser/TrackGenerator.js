import Track from '../track/Track.js';

export default class TrackGenerator {
    constructor(track) {
        /** @type {Track} */
        this.track = track;

        this.stepSize = 1000;

        this.memReset();

        let grid = this.track.grid;
        this.length = grid.totalSolidLines.length + grid.totalSceneryLines.length + grid.totalObjects.length;
    }

    memReset() {
        this.done = false;
        this.currentStep = this.generateLines;
        this.progress = 0;
        this.lineData = this.emptyData();
        this.sceneryData = this.emptyData();
        this.objectData = this.emptyData();
    }

    generate(lineData, gridTarget, nextStep) {
        let toGo = this.stepSize;
        let l = Math.min(lineData.index + toGo, gridTarget.length);
        for (; lineData.index < l; lineData.index++) {
            let line = gridTarget[lineData.index];
            if (!line.recorded) {
                lineData.code += `${line.toString()},`;
            }
        }

        if (lineData.index >= gridTarget.length) {
            this.currentStep = nextStep;
        }
    }

    generateLines() {
        this.generate(this.lineData, this.track.grid.totalSolidLines, this.generateScenery);
    }

    generateScenery() {
        this.generate(this.sceneryData, this.track.grid.totalSceneryLines, this.generateObjects);
    }

    generateObjects() {
        let toGo = this.stepSize;
        let l = Math.min(this.objectData.index + toGo, this.track.grid.totalObjects.length);
        for (; this.objectData.index < l; this.objectData.index++) {
            let object = this.track.grid.totalObjects[this.objectData.index];
            this.objectData.code += `${object.toString()},`;
        }

        if (this.objectData.index >= this.track.grid.totalObjects.length) {
            this.currentStep = this.finish;
        }
    }

    finish() {
        this.cleanup();
        this.done = true;
    }

    cleanup() {
        this.track.grid.totalSolidLines.forEach((line, key) => (line.recorded = false));
        this.track.grid.totalSceneryLines.forEach((line, key) => (line.recorded = false));
    }

    getCode() {
        return `${this.lineData.code}#${this.sceneryData.code}#${this.objectData.code}#${this.track.playerRunner.bikeClass.bikeName}`;
    }

    emptyData() {
        return { code: '', index: 0 };
    }
}
