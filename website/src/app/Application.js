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
            this.ws.send(JSON.stringify({ type: 'join', data: 0 }));
        });
        this.ws.addEventListener('close', e => {
            console.log(`Connection to localhost has been closed`);
        });

        this.ws.onmessage = e => this.onMessage(e);
    }

    runGame(data) {
        let gameContainer = document.createElement('div');
        gameContainer.id = 'game';

        document.body.appendChild(gameContainer);

        this.game = new Game(gameContainer, { trackCode: data.trackCode, name: data.name, color: data.color }, this);
        this.game.run();
        this.game.stateManager.push('parser');
    }

    onMessage(e) {
        let msg = JSON.parse(e.data);

        switch (msg.type) {
            case 'join':
                if (!!msg.data) {
                    this.runGame(msg.data);
                } else {
                }
                break;
        }
    }
}
