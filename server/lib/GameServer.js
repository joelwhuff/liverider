import { WebSocketServer } from 'ws';

export default class GameServer extends WebSocketServer {
    constructor(options) {
        super(options);

        this.clients = new Set();

        this.rooms = new Map();
    }
}
