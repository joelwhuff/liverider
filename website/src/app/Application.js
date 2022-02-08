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
        this.ws = new WebSocket('ws://localhost:80');

        this.ws.binaryType = 'arraybuffer';

        this.ws.addEventListener('error', e => {
            console.error(`Error has occured on connection to localhost`, e);
            this.ws.close();
        });
        this.ws.addEventListener('open', e => {
            console.log(`Connection to localhost established`);
            this.ws.send(JSON.stringify({ type: 'join', data: 1 }));
        });
        this.ws.addEventListener('close', e => {
            console.log(`Connection to localhost has been closed`);
        });

        this.ws.onmessage = e => this.onMessage(e);
    }

    bootGame(user) {
        let gameContainer = document.createElement('div');
        gameContainer.id = 'game';

        document.body.appendChild(gameContainer);

        this.game = new Game(gameContainer, { ws: this.ws, user: user });
        this.game.run();
        this.game.stateManager.room.sendJSON({ type: 'ready' });
    }

    onMessage(e) {
        let msg = JSON.parse(e.data);

        if (msg.type === 'join') {
            this.bootGame(msg.data.user);
        }
    }
}
