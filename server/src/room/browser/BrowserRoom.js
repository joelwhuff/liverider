import Room from '../Room.js';
import BrowserActiveMessage from './message/BrowserActiveMessage.js';

export default class BrowserRoom extends Room {
    addClient(client) {
        super.addClient(client);

        client.setMessageParser(this.constructor.messageStages.get('active'));
    }
}

BrowserRoom.messageStages = new Map();
BrowserRoom.messageStages.set('active', BrowserActiveMessage);
