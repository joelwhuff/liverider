import SocketRunner from '../../bike/SocketRunner.js';

export default class RaceMessage {
    static 0(room, data) {
        room.track.socketRunners.get(data[0]).parseKeyPress(data[1], data[2]);
    }

    static 'adduser'(room, data) {
        room.users.set(data.id, { name: data.name, color: data.color });
        let runner = new SocketRunner(room.track, room.track.bikeClass, data.name, data.color);
        room.track.socketRunners.set(data.id, runner);
        runner.createBike();
    }

    static 'deleteuser'(room, data) {
        room.users.delete(data);
        room.track.socketRunners.delete(data);
    }

    static 'time'(room, data) {
        room.sendJSON({
            type: 'time',
            data: { id: data, time: room.track.time },
        });
    }

    static 'keylog'(room, data) {
        let runner = new SocketRunner(
            room.track,
            room.track.bikeClass,
            room.users.get(data.id).name,
            room.users.get(data.id).color
        );
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

    static 'trackdata'(room, data) {
        room.track.trackCode = data;
        room.stateManager.push('parser');
    }

    static 'message'(room, data) {
        let user = room.users.get(data.id);
        room.stateManager.game.ui.addMessage(user.name, user.color, data.text);
    }
}
