import Game from '../game/Game.js';

export default class Application {
    constructor() {
        this.ws = null;

        this.game = null;
    }

    boot() {
        this.initConnection();
    }

    initConnection() {
        this.ws = new WebSocket('ws://10.0.0.201:80');

        this.ws.binaryType = 'arraybuffer';

        this.ws.addEventListener('error', e => {
            console.error(`Error has occured on connection to localhost`, e);
            this.ws.close();
        });
        this.ws.addEventListener('open', e => {
            console.log(`Connection to localhost established`);
            this.ws.send(JSON.stringify({ type: 100, data: { id: 1 } }));
        });
        this.ws.addEventListener('close', e => {
            console.log(`Connection to localhost has been closed`);
        });

        this.ws.onmessage = e => this.onMessage(e);
    }

    bootGame() {
        let gameContainer = document.createElement('div');
        gameContainer.id = 'game';

        document.body.appendChild(gameContainer);

        this.game = new Game(gameContainer, { ws: this.ws });
        this.game.run();
        this.game.stateManager.room.sendFloat64Array([101]);
    }

    onMessage(e) {
        let msg = new Float64Array(e.data);

        if (msg[0]) {
            this.bootGame();
        } else {
            console.log(msg[1]);
        }
    }
}
