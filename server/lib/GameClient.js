import fs from 'fs';

import WebSocket, { WebSocketServer } from 'ws';

import { generateColorfulRGB } from './utils.js';

let defaultMessageParser = (type, data, client) => {
    switch (type) {
        case 'join':
            if (client.server.hasRoom(data)) {
                fs.readFile('tracks/mockba.txt', 'utf8', (err, trackCode) => {
                    if (err) {
                        client.sendJSON({ type: 'join' });
                        return;
                    }
                    client.info.color = generateColorfulRGB();
                    client.joinRoom(data);
                    client.sendJSON({
                        type: 'join',
                        data: { trackCode: trackCode, name: client.info.name, color: client.info.color },
                    });
                });
            } else {
                client.sendJSON({ type: 'join' });
            }
            break;
        default:
            client.destroy();
    }
};

export default class GameClient {
    /**
     * @param {WebSocket} ws
     * @param {WebSocketServer} server
     */
    constructor(ws, server) {
        this.ws = ws;

        this.server = server;

        this.room = null;

        this.id;
        this.info = new Object();

        this.parseMessage = defaultMessageParser;

        // make this 2d array maybe keyLog = [[],[],[],[],[],[],[],[],[],[]]
        this.keyLog = new Map();
        this.keyLog.set(0, new Array());
        this.keyLog.set(1, new Array());
        this.keyLog.set(2, new Array());
        this.keyLog.set(3, new Array());
        this.keyLog.set(4, new Array());

        this.restartPressed = new Array();
        this.cancelPressed = new Array();
        this.pausePressed = new Array();
        this.unpausePressed = new Array();
        this.switchBikePressed = new Array();
    }

    registerListeners() {
        this.ws.binaryType = 'arraybuffer';

        this.ws
            .on('error', e => {
                this.onError(e);
            })
            .on('open', () => {
                this.onOpen();
            })
            .on('message', (data, isBinary) => {
                this.onMessage(data, isBinary);
            })
            .on('close', () => {
                this.onClose();
            });
    }

    joinRoom(id) {
        let room = this.server.rooms.get(id);
        if (room) {
            this.parseMessage = room.parseMessage.bind(room);
            room.addClient(this);
            this.room = room;
        }
    }

    parseBuffer(data) {
        this.parseMessage(new Float64Array(data, 0, 1)[0], new Float64Array(data, 8), this);
    }

    parseJSON(data) {
        let msg;
        try {
            msg = JSON.parse(data.toString());
        } catch (err) {
            this.destroy();
            return;
        }

        this.parseMessage(msg.type, msg.data, this);
    }

    onError(e) {}

    onOpen() {}

    onMessage(data, isBinary) {
        if (isBinary) {
            this.parseBuffer(data);
        } else {
            this.parseJSON(data);
        }
    }

    send(msg) {
        this.ws.send(msg);
    }

    sendJSON(msg) {
        this.ws.send(JSON.stringify(msg));
    }

    onClose() {
        this.server.deleteClient(this);
        if (this.room) {
            this.room.deleteClient(this.id);
        }
    }

    destroy() {}
}
