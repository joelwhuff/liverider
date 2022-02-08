import Room from '../Room.js';
import DefaultActiveMessage from './message/DefaultActiveMessage.js';

export default class DefaultRoom extends Room {
    addClient(client) {
        super.addClient(client);

        client.setMessageParser(this.constructor.messageStages.get('active'));
    }
}

DefaultRoom.messageStages = new Map();
DefaultRoom.messageStages.set('active', DefaultActiveMessage);
