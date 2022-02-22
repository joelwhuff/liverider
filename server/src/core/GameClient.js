import WebSocket from 'ws';

import GameServer from './GameServer.js';
import Color from '../util/Color.js';

export default class GameClient {
    /**
     * @param {WebSocket} ws
     * @param {GameServer} server
     */
    constructor(server, ws) {
        this.server = server;

        this.ws = ws;

        this.room = null;

        this.id = 0;
        this.name = '';
        this.color = Color.randomHex(0.6);

        this.messageParser = null;
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

    resetRaceProps() {
        this.spectating = false;
        this.stopped = true;
        this.finalTime = null;

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

    onError() {
        this.destroy();
    }

    onOpen() {}

    onMessage(data, isBinary) {
        if (isBinary) {
            this.parseBuffer(data);
        } else {
            this.parseJSON(data);
        }
    }

    onClose() {
        this.room?.deleteClient(this.id);
        this.server.deleteClient(this);
    }

    send(msg) {
        this.ws.send(msg);
    }

    parseBuffer(data) {
        try {
            this.messageParser[new Uint8Array(data, 0, 1)[0]](this.room, this, data);
        } catch (err) {
            console.log(err);
            this.destroy();
        }
    }

    parseJSON(data) {
        try {
            let msg = JSON.parse(data.toString());
            this.messageParser[msg.type](this.room, this, msg.data);
        } catch (err) {
            console.log(err);
            this.destroy();
        }
    }

    destroy() {
        this.ws.terminate();
    }
}
