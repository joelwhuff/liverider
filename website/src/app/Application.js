import Game from '../game/Game.js';

export default class Application {
    constructor() {
        this.game = null;
    }

    boot() {
        let canvas = document.createElement('canvas');
        canvas.id = 'game';
        document.body.appendChild(canvas);

        let setContextProperties = ctx => {
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.font = 'bold 15px Ubuntu';
        };

        let setCanvasSize = () => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;

            setContextProperties(canvas.getContext('2d'));
        };

        window.addEventListener('resize', () => setCanvasSize());
        setCanvasSize();

        this.game = new Game(canvas);
        this.game.run();
        this.game.stateManager.push('parser');
    }
}
