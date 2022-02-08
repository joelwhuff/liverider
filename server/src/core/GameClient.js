import WebSocket, { WebSocketServer } from 'ws';

import Color from '../util/Color.js';

export default class GameClient {
    /**
     * @param {WebSocket} ws
     * @param {WebSocketServer} server
     */
    constructor(ws, server) {
        this.ws = ws;

        this.server = server;

        this.room = null;

        this.messageParser = null;

        this.id = 0;
        this.name = 'test';
        this.color = Color.randomHex(0.7);

        this.keyLog = [
            [] /* upPressed */,
            [] /* downPressed */,
            [] /* leftPressed */,
            [] /* rightPressed */,
            [] /* turnPressed */,
            [] /* restartPressed */,
            [] /* cancelPressed */,
            [] /* pausePressed */,
            [] /* unpausePressed */,
            [] /* switchBikePressed */,
        ];
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
            .on('close', e => {
                this.onClose(e);
            });
    }

    setMessageParser(parser) {
        this.messageParser = parser;
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

    onClose(e) {
        this.server.deleteClient(this);
        if (this.room) {
            this.room.deleteClient(this.id);
        }
    }

    send(msg) {
        this.ws.send(msg);
    }

    parseBuffer(data) {
        this.messageParser[new Float64Array(data, 0, 1)[0]]?.(this, new Float64Array(data, 8));
    }

    parseJSON(data) {
        try {
            let msg = JSON.parse(data.toString());
            this.messageParser[msg.type](this, msg.data);
        } catch (err) {
            this.destroy();
        }
    }

    destroy() {}
}
