import RaceActiveMessage from './RaceActiveMessage.js';

export default class RaceLoadingMessage extends RaceActiveMessage {
    static 'users'(room, data) {
        data.forEach(user => {
            room.users.set(user.id, { name: user.name, color: user.color });
        });
    }

    static 0(room, data) {}

    static 'addrunner'(room, data) {}

    static 'time'(room, data) {}

    static 'keylog'(room, data) {}
}
