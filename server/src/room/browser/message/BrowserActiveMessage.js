import * as MSG from '../constant/MessageConstants.js';

export default class DefaultActiveMessage {
    static [MSG.JOIN](sender, data) {
        let room = sender.server.getRoom(data.id);
        if (room) {
            if (!room.password || data.password === room.password) {
                sender.send(new Float64Array([MSG.JOIN_SUCCEEDED]));
                sender.room = room;
            } else {
                sender.send(new Float64Array([MSG.JOIN_FAILED, MSG.INCORRECT_PASSWORD]));
            }
        } else {
            sender.send(new Float64Array([MSG.JOIN_FAILED, MSG.ROOM_DOES_NOT_EXIST]));
        }
    }

    static [MSG.READY](sender) {
        sender.room.addClient(sender);
    }
}
