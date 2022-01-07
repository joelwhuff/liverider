import Game from '../game/Game.js';

export default class Application {
    constructor() {
        this.game = null;
    }

    boot() {
        let gameContainer = document.createElement('div');
        gameContainer.id = 'game';

        let canvas = document.createElement('canvas');
        gameContainer.appendChild(canvas);

        let setContextProperties = ctx => {
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.font = 'bold 15px Ubuntu-R';
        };

        let setCanvasSize = () => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;

            setContextProperties(canvas.getContext('2d'));
        };

        document.body.appendChild(gameContainer);
        window.addEventListener('resize', () => setCanvasSize());
        setCanvasSize();

        this.game = new Game(canvas);
        this.game.run();
        this.game.stateManager.push('parser');
    }
}
