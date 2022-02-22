import Room from '../Room.js';
import RaceLoadingMessage from './message/RaceLoadingMessage.js';
import RaceActiveMessage from './message/RaceActiveMessage.js';
import RaceResults from '../../ui/RaceResults.js';
import { UNSTOP } from '../../constant/RoomConstants.js';

export default class RaceRoom extends Room {
    constructor(stateManager, ws) {
        super(stateManager, ws);

        super.setMessageParser('loading');

        this.state = new Object();

        this.timeout;
        this.interval;
    }

    setState(state) {
        clearTimeout(this.timeout);
        clearInterval(this.interval);

        this.state = state;
        this[this.state.name]();
    }

    stage1Lobby() {
        this.state.message = { text: 'Need 1 more player to start', size: 22, top: 100 };
    }

    stage2LobbyCountdown() {
        this.state.message = { text: 'Race starting...', size: 22, top: 100 };

        let delay = this.state.delay;
        if (delay > 1000) {
            let text = 'Next race starting in ';
            this.state.message.text = text + Math.ceil(delay / 1000);

            let small = delay - Math.floor(delay / 1000) * 1000;

            this.timeout = setTimeout(() => {
                delay -= small;
                this.state.message.text = text + Math.round(delay / 1000);
                this.interval = setInterval(() => {
                    delay -= 1000;
                    if (delay > 999) {
                        this.state.message.text = text + Math.round(delay / 1000);
                    } else {
                        clearInterval(this.interval);
                        this.state.message.text = 'Race starting...';
                    }
                }, 1000);
            }, small);
        }
    }

    stage3PreRace() {
        if (this.raceResults) {
            this.raceResults.destroy();
            this.raceResults = null;
        }

        this.state.message = { text: 'Waiting for players', size: 22, top: 200 };
        this.track.stopped = true;
    }

    stage4Racing() {
        this.track.stopped = true;

        this.state.message = { text: '', size: 36, top: 200 };

        let startRacing = () => {
            this.state.message.text = 'GO';
            setTimeout(() => {
                this.state.message = null;
            }, 1500);
            super.send(new Uint8Array([UNSTOP]));
            this.track.stopped = false;
        };

        let delay = this.state.delay;

        if (delay <= 0) {
            return startRacing();
        }

        this.state.message.text = Math.ceil(delay / 1000);

        let small = delay - Math.floor(delay / 1000) * 1000;

        this.timeout = setTimeout(() => {
            delay -= small;
            if (delay > 999) {
                this.state.message.text = Math.round(delay / 1000);
                this.interval = setInterval(() => {
                    delay -= 1000;
                    if (delay > 999) {
                        this.state.message.text = Math.round(delay / 1000);
                    } else {
                        clearInterval(this.interval);
                        startRacing();
                    }
                }, 1000);
            } else {
                startRacing();
            }
        }, small);
    }

    stage5RaceEnd() {
        let delay = this.state.delay;
        let text = `${this.state.winner} finished! Time remaining - `;
        this.state.message = { text: text + Math.ceil(delay / 1000), size: 22, top: 100 };

        let small = delay - Math.floor(delay / 1000) * 1000;

        this.timeout = setTimeout(() => {
            delay -= small;
            if (delay > 999) {
                this.state.message.text = text + Math.round(delay / 1000);
                this.interval = setInterval(() => {
                    delay -= 1000;
                    if (delay > 999) {
                        this.state.message.text = text + Math.round(delay / 1000);
                    } else {
                        clearInterval(this.interval);
                        this.state.message.text = 'Race Over';
                    }
                }, 1000);
            } else {
                this.state.message.text = 'Race Over';
            }
        }, small);
    }

    displayResults(results) {
        this.raceResults = new RaceResults(this.stateManager.game.ui.gameScreen, this.stateManager);
        this.raceResults.render(this, results);
    }

    render(ctx) {
        if (this.track.spectating) {
            ctx.save();
            ctx.font = `bold ${22}px Ubuntu`;
            ctx.textAlign = 'center';
            ctx.fillStyle = '#000';
            ctx.fillText('Race in progress', this.track.canvas.width / 2, 60);
            ctx.restore();
        }

        if (this.state.message) {
            ctx.save();
            ctx.font = `bold ${this.state.message.size}px Ubuntu`;
            ctx.textAlign = 'center';
            ctx.fillStyle = '#000';
            ctx.fillText(this.state.message.text, this.track.canvas.width / 2, this.state.message.top);
            ctx.restore();
        }
    }
}

RaceRoom.messageStages = new Map();
RaceRoom.messageStages.set('loading', RaceLoadingMessage);
RaceRoom.messageStages.set('active', RaceActiveMessage);
