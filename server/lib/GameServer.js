import { WebSocketServer } from 'ws';

import GameClient from './GameClient.js';

export default class GameServer extends WebSocketServer {
    constructor(options) {
        super(options);

        this.clients = new Set();

        this.rooms = new Map();
    }

    init() {
        this.on('connection', (ws, req) => {
            this.onConnection(ws, req);
        });
    }

    onConnection(ws, req) {
        let client = new GameClient(ws, this);
        client.registerListeners();

        this.clients.add(client);
    }

    deleteClient(client) {
        this.clients.delete(client);
    }

    addRoom(room) {
        this.rooms.set(GameServer.roomId++, room);
    }

    hasRoom(id) {
        return this.rooms.has(id);
    }

    deleteRoom(id) {
        this.rooms.delete(id);
    }
}

GameServer.roomId = 0;
