import Game from '../game/Game.js';

export default class Application {
    constructor() {
        this.game = null;
    }

    boot() {
        let gameContainer = document.createElement('div');
        gameContainer.id = 'game';

        document.body.appendChild(gameContainer);

        this.game = new Game(gameContainer);
        this.game.run();
        this.game.stateManager.push('parser');
    }
}
