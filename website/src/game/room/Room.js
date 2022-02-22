export default class Room {
    constructor(stateManager, ws) {
        this.stateManager = stateManager;

        this.ws = ws;

        this.track = stateManager.track;

        this.messageParser = null;

        this.users = new Map();

        this.init();
    }

    init() {
        this.ws.onmessage = e => this.onMessage(e);
    }

    setMessageParser(key) {
        this.messageParser = this.constructor.messageStages.get(key);
    }

    send(msg) {
        this.ws.send(msg);
    }

    /**
     * @param {Object} obj
     */
    sendJSON(obj) {
        this.send(JSON.stringify(obj));
    }

    sendKeyPress(keyIndex, time) {
        let buf = new ArrayBuffer(8);
        new Uint8Array(buf, 1, 1)[0] = keyIndex;
        new Uint32Array(buf, 4)[0] = time;
        this.send(buf);
    }

    onMessage(e) {
        let data = e.data;

        if (typeof data === 'string') {
            let msg = JSON.parse(data);
            this.messageParser[msg.type](this, msg.data);
        } else {
            this.messageParser[new Uint8Array(data, 0, 1)[0]](this, data);
        }
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {}
}
