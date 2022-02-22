import * as MSG from '../constant/MessageConstants.js';

export default class DefaultActiveMessage {
    static [MSG.JOIN](room, sender, data) {
        let _room = sender.server.getRoom(data.id);
        if (_room) {
            if (!_room.password || data.password === _room.password) {
                sender.send(new Uint8Array([MSG.JOIN_SUCCEEDED]));
                sender.room = _room;
            } else {
                sender.send(new Uint8Array([MSG.JOIN_FAILED, MSG.INCORRECT_PASSWORD]));
            }
        } else {
            sender.send(new Uint8Array([MSG.JOIN_FAILED, MSG.ROOM_DOES_NOT_EXIST]));
        }
    }

    static [MSG.READY](room, sender) {
        room.addClient(sender);
    }

    static 'name'(room, sender, data) {
        if (data.length > 8) {
            sender.send(new Uint8Array([MSG.NAME_INVALID]));
        } else {
            sender.send(new Uint8Array([MSG.NAME_SET_SUCCESSFULLY]));
            sender.name = data;
        }
    }
}
