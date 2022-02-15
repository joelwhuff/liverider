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

    /**
     * @param {number[]} arr
     */
    sendFloat64Array(arr) {
        this.send(new Float64Array(arr));
    }

    onMessage(e) {
        let data = e.data;

        if (typeof data === 'string') {
            let msg = JSON.parse(data);
            this.messageParser[msg.type](this, msg.data);
        } else {
            this.messageParser[new Float64Array(data, 0, 1)[0]](this, new Float64Array(data, 8));
        }
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {}
}
