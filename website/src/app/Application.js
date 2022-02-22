import Game from '../game/Game.js';
import Login from '../game/ui/Login.js';

// this is all temp crap

export default class Application {
    constructor() {
        this.ws = null;

        this.game = null;
    }

    boot() {
        this.initConnection();
        this.login = new Login(document.body, this);
        this.login.render();
    }

    initConnection() {
        this.ws = new WebSocket(`${document.location.protocol === 'https:' ? 'wss' : 'ws'}://localhost`);

        this.ws.binaryType = 'arraybuffer';

        this.ws.addEventListener('error', e => {
            console.error(`Error has occured on connection to localhost`, e);
            this.ws.close();
        });
        this.ws.addEventListener('open', e => {
            console.log(`Connection to localhost established`);
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
        this.game.stateManager.room.send(new Uint8Array([101]));
    }

    onMessage(e) {
        let msg = new Uint8Array(e.data);

        switch (msg[0]) {
            case 1:
                this.bootGame();
                break;
            case 0:
                console.log(msg[1]);
                break;
            case 201:
                this.ws.send(JSON.stringify({ type: 100, data: { id: 1 } }));
                this.login.destroy();
                this.login = null;
                break;
        }
    }
}
