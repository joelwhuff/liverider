import { WebSocketServer } from 'ws';

import GameClient from './GameClient.js';

export default class GameServer {
    constructor(options) {
        this.wss = new WebSocketServer(options);

        this.blacklist = new Array();

        this.clients = new Set();

        this.rooms = new Map();
        this.roomId = 0;
    }

    init() {
        this.wss.on('connection', (ws, req) => {
            this.onConnection(ws, req);
        });
    }

    onConnection(ws, req) {
        let client = new GameClient(ws, this);
        client.registerListeners();
        this.getRoom(0).addClient(client);

        this.clients.add(client);
    }

    deleteClient(client) {
        this.clients.delete(client);
    }

    addRoom(room) {
        this.rooms.set(this.roomId++, room);
    }

    getRoom(id) {
        return this.rooms.get(id);
    }

    hasRoom(id) {
        return this.rooms.has(id);
    }

    deleteRoom(id) {
        this.rooms.delete(id);
    }
}
