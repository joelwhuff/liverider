import Track from '../../../track/Track.js';
import SocketRunner from '../../../bike/SocketRunner.js';
import { KEY_PRESSED, TIME, UNSTOP } from '../constant/RaceMessageConstants.js';

export default class RaceActiveMessage {
    static [KEY_PRESSED](room, data) {
        room.track.socketRunners.get(data[0]).parseKeyPress(data[1], data[2]);
    }

    static [TIME](room, data) {
        if (!room.track.spectating) {
            let time = Math.floor(
                (performance.now() - room.stateManager.game.lastTime) / room.stateManager.game.frameDuration
            );

            room.sendFloat64Array([TIME, data[0], room.track.time + time]);
        }
    }

    static [UNSTOP](room, data) {
        let runner = room.track.socketRunners.get(data[0]);
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
        let time = Math.ceil(
            (performance.now() - room.stateManager.game.lastTime) / room.stateManager.game.frameDuration
        );
        runner.initialTime -= time;
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
