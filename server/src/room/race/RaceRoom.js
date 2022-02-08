import fs from 'fs';

import Room from '../Room.js';
import RaceVerificationMessage from './message/RaceVerificationMessage.js';
import RaceInitializationMessage from './message/RaceInitializationMessage.js';
import RaceActiveMessage from './message/RaceActiveMessage.js';

export default class RaceRoom extends Room {
    addClient(client) {
        // client is officially added to room when 'parserdone' message is received
        client.id = this.clientId++;
        client.room = this;

        client.name = 'user' + client.id;
        client.setMessageParser(this.constructor.messageStages.get('initialization'));

        client.send(
            JSON.stringify({
                type: 'join',
                data: { user: { name: client.name, color: client.color } },
            })
        );
    }

    deleteClient(clientId) {
        super.deleteClient(clientId);

        super.broadcast(JSON.stringify({ type: 'deleteuser', data: clientId }));
    }
}

RaceRoom.messageStages = new Map();
RaceRoom.messageStages.set('verification', RaceVerificationMessage);
RaceRoom.messageStages.set('initialization', RaceInitializationMessage);
RaceRoom.messageStages.set('active', RaceActiveMessage);

RaceRoom.LOBBY_TRACK_CODE = fs.readFileSync('server/tracks/mockba.txt', 'utf8');
