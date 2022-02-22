import Track from '../../../track/Track.js';
import SocketRunner from '../../../bike/SocketRunner.js';
import { KEY_PRESSED, TIME, UNSTOP } from '../../../constant/RoomConstants.js';

export default class RaceActiveMessage {
    static [KEY_PRESSED](room, data) {
        let id = new Uint16Array(data, 2, 1)[0];
        let key = new Uint8Array(data, 1, 1)[0];
        let time = new Uint32Array(data, 4)[0];

        room.track.socketRunners.get(id).parseKeyPress(key, time);
    }

    static [TIME](room, data) {
        if (!room.track.spectating) {
            let time = Math.floor(
                (performance.now() - room.stateManager.game.lastTime) / room.stateManager.game.frameDuration
            );

            let buf = new ArrayBuffer(8);
            new Uint8Array(buf, 0, 1)[0] = TIME;
            new Uint16Array(buf, 2, 1)[0] = new Uint16Array(data, 2)[0];
            new Uint32Array(buf, 4)[0] = room.track.time + time;
            room.send(buf);
        }
    }

    static [UNSTOP](room, data) {
        let runner = room.track.socketRunners.get(new Uint16Array(data, 2)[0]);
        if (runner) {
            runner.stopped = false;
        }
    }

    static 'keylog'(room, data) {
        let user = room.users.get(data.id);
        let runner = new SocketRunner(room.track, room.track.bikeClass, user.name, user.color);
        runner.stopped = data.stopped;
        for (let key in data.keys) {
            runner.keys.get(key).push(...data.keys[key]);
        }
        runner.restartPressed.push(...data.restartPressed);
        runner.cancelPressed.push(...data.cancelPressed);
        runner.pausePressed.push(...data.pausePressed);
        runner.unpausePressed.push(...data.unpausePressed);
        runner.switchBikePressed.push(...data.switchBikePressed);

        runner.runUpdates(data.time);

        room.track.socketRunners.set(data.id, runner);
    }

    static 'users'(room, data) {
        data.forEach(user => {
            room.users.set(user.id, { name: user.name, color: user.color });
        });
    }

    static 'adduser'(room, data) {
        room.users.set(data.id, { name: data.name, color: data.color });
    }

    static 'deleteuser'(room, data) {
        room.users.delete(data);
        room.track.socketRunners.delete(data);
    }

    static 'addrunner'(room, data) {
        let user = room.users.get(data.id);
        let runner = new SocketRunner(room.track, room.track.bikeClass, user.name, user.color);
        runner.stopped = data.stopped;
        runner.createBike();
        room.track.socketRunners.set(data.id, runner);

        // This causes runners that are added when the document is hidden to
        // receive the correct number of fixedUpdates when window is in focus again
        let time = Math.floor(
            (performance.now() - room.stateManager.game.lastTime) / room.stateManager.game.frameDuration
        );
        runner.initialTime = -time;
        runner.time = runner.initialTime;
    }

    static 'trackdata'(room, data) {
        room.setMessageParser('loading');

        room.stateManager.track.event.detach();
        room.stateManager.track = new Track(room.stateManager.track.canvas, {
            trackCode: data.trackCode,
            room: room,
            user: data.user || room.stateManager.track.user,
            spectating: !!data.spectating,
        });
        room.track = room.stateManager.track;

        room.stateManager.stateStack = new Array();
        room.stateManager.push('parser');

        room.setState(data.state);

        if (data.spectating) {
            room.track.playerRunner.createBike = () => {};
        }
    }

    static 'state'(room, data) {
        room.setState(data);
    }

    static 'results'(room, data) {
        room.displayResults(data);
    }

    static 'message'(room, data) {
        let user = room.users.get(data.id);
        room.stateManager.game.ui.addMessage(user.name, user.color, data.text);
    }
}
