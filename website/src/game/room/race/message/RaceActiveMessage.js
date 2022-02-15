import Track from '../../../track/Track.js';
import SocketRunner from '../../../bike/SocketRunner.js';

export default class RaceActiveMessage {
    static 0(room, data) {
        room.track.socketRunners.get(data[0]).parseKeyPress(data[1], data[2]);
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
    }

    static 'time'(room, data) {
        room.sendJSON({
            type: 'time',
            data: { id: data, time: room.track.time },
        });
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

    static 'unstop'(room, data) {
        room.track.socketRunners.get(data).stopped = false;
    }

    static 'trackdata'(room, data) {
        room.setMessageParser('loading');

        room.stateManager.track.event.detach();
        room.stateManager.track = new Track(room.stateManager.track.canvas, {
            trackCode: data.trackCode,
            room: room,
            user: data.user || room.stateManager.track.user,
        });
        room.track = room.stateManager.track;

        room.stateManager.stateStack = new Array();
        room.stateManager.push('parser');

        room.setState(data.state);
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
