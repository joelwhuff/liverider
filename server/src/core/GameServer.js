import { WebSocketServer } from 'ws';

import GameClient from './GameClient.js';

export default class GameServer {
    #clients;
    #rooms;
    #roomId;

    constructor(options) {
        this.wss = new WebSocketServer(options);

        this.#clients = new Set();

        this.#rooms = new Map();
        this.#roomId = 0;
    }

    #onConnection(ws) {
        let client = new GameClient(this, ws);
        client.registerListeners();

        // room 0 is the browser room
        this.getRoom(0).addClient(client);

        this.addClient(client);
    }

    init() {
        this.wss.on('connection', ws => {
            this.#onConnection(ws);
        });
    }

    addClient(client) {
        this.#clients.add(client);
    }

    deleteClient(client) {
        this.#clients.delete(client);
    }

    addRoom(room) {
        this.#rooms.set(this.#roomId++, room);
    }

    getRoom(id) {
        return this.#rooms.get(id);
    }

    deleteRoom(id) {
        this.#rooms.delete(id);
    }
}

GameServer.blacklist = new Array();
