import Cell from './Cell.js';

export default class RenderCell extends Cell {
    constructor(x, y, size) {
        super(x, y, size);

        this.canvas = new Map();
    }

    clear() {
        this.canvas = new Map();
    }

    /**
     * @return {number} zoom
     * @return {HTMLCanvasElement}
     */
    getCanvas(zoom) {
        if (!this.canvas.has(zoom)) {
            this.canvas.set(zoom, this.renderCache(zoom));
        }

        return this.canvas.get(zoom);
    }

    /**
     * @return {number} zoom
     * @return {HTMLCanvasElement}
     */
    renderCache(zoom) {
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');

        canvas.width = this.size * zoom;
        canvas.height = this.size * zoom;

        context.lineCap = 'round';
        context.lineWidth = Math.max(2 * zoom, 0.5);
        context.strokeStyle = '#aaa';

        context.beginPath();
        for (let i = this.scenery.length - 1; i >= 0; --i) {
            this.scenery[i].renderCache(context, this.x * zoom, this.y * zoom, zoom);
        }
        context.stroke();

        context.strokeStyle = '#000';
        context.beginPath();
        for (let i = this.lines.length - 1; i >= 0; --i) {
            this.lines[i].renderCache(context, this.x * zoom, this.y * zoom, zoom);
        }
        context.stroke();

        return canvas;
    }
}
