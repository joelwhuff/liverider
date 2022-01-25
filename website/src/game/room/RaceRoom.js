import Room from './Room.js';
import SocketRunner from '../bike/SocketRunner.js';

export default class RaceRoom extends Room {
    constructor(ws) {
        super();
        this.ws = ws;

        this.track = null;

        this.users = new Map();

        this.registerListeners();
    }

    registerListeners() {
        this.ws.onmessage = e => this.onMessage(e);
    }

    send(msg) {
        this.ws.send(msg);
    }

    sendJSON(msg) {
        this.send(JSON.stringify(msg));
    }

    sendBuffer(arr) {
        this.send(new Float64Array(arr));
    }

    onMessage(e) {
        let data = e.data;

        if (typeof data === 'string') {
            let msg = JSON.parse(data);
            this.parseMessage(msg.type, msg.data);
        } else {
            this.parseMessage(new Float64Array(data, 0, 1)[0], new Float64Array(data, 8));
        }
    }

    // include tools in here too
    parseKeyPress(clientId, key, time) {
        let runner = this.track.socketRunners.get(clientId);
        // if time < runner.time => runUpdates again (rerunning right back to current time is probably fine)
        switch (key) {
            case 0:
                runner.keys.get('upPressed').push(time);
                break;
            case 1:
                runner.keys.get('downPressed').push(time);
                break;
            case 2:
                runner.keys.get('leftPressed').push(time);
                break;
            case 3:
                runner.keys.get('rightPressed').push(time);
                break;
            case 4:
                runner.keys.get('turnPressed').push(time);
                break;
        }
    }

    parseMessage(type, data) {
        // CollabMessage[type](data, this)
        switch (type) {
            case 0:
                this.parseKeyPress(data[0], data[1], data[2]);
                break;
            case 1: {
                // if (time < runner.time) runUpdates again (rerunning right back to current time is probably fine)
                let runner = this.track.socketRunners.get(data[0]);
                runner.restartPressed.push(data[1]);
                break;
            }
            case 2: {
                let runner = this.track.socketRunners.get(data[0]);
                runner.cancelPressed.push(data[1]);
                break;
            }
            case 3: {
                let runner = this.track.socketRunners.get(data[0]);
                runner.pausePressed.push(data[1]);
                break;
            }
            case 4: {
                let runner = this.track.socketRunners.get(data[0]);
                runner.unpausePressed.push(data[1]);
                break;
            }
            case 5: {
                let runner = this.track.socketRunners.get(data[0]);
                runner.switchBikePressed.push(data[1]);
                break;
            }
            case 'new_user': {
                setTimeout(() => {
                    this.users.set(data.id, data.info);
                    let runner = new SocketRunner(this.track, this.track.bikeClass, data.info.color, data.info.name);
                    this.track.socketRunners.set(data.id, runner);
                    runner.createBike();
                }, 80);
                break;
            }
            case 'user_dc':
                this.track.socketRunners.delete(data);
                this.users.delete(data);
                break;
            case 'time':
                this.sendJSON({
                    type: 'time',
                    data: { id: data, time: this.track.time },
                });
                break;
            case 'keylog': {
                let runner = new SocketRunner(
                    this.track,
                    this.track.bikeClass,
                    this.users.get(data.id).color,
                    this.users.get(data.id).name
                );
                for (let key in data.keys) {
                    runner.keys.get(key).push(...data.keys[key]);
                }
                runner.restartPressed.push(...data.restartPressed);
                runner.cancelPressed.push(...data.cancelPressed);
                runner.pausePressed.push(...data.pausePressed);
                runner.unpausePressed.push(...data.unpausePressed);
                runner.switchBikePressed.push(...data.switchBikePressed);

                runner.runUpdates(data.time - 4);

                this.track.socketRunners.set(data.id, runner);
                break;
            }
            case 'users':
                data.forEach(user => {
                    this.users.set(user.id, user.info);
                });
                break;
        }
    }
}
