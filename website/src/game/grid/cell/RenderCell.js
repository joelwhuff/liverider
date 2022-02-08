import Cell from './Cell.js';
import SceneryLine from '../../item/line/SceneryLine.js';
import Item from '../../item/Item.js';
import SolidLine from '../../item/line/SolidLine.js';

export default class RenderCell extends Cell {
    constructor(x, y, size) {
        super(x, y, size);

        this.canvas = new Map();
    }

    clear() {
        this.canvas = new Map();
    }

    push(item) {
        if (item instanceof SceneryLine) {
            this.scenery.push(item);
            this.renderLine(item, '#aaa', 'destination-over');
        } else if (item instanceof SolidLine) {
            this.lines.push(item);
            this.renderLine(item, '#000');
        } else if (item instanceof Item) {
            this.objects.push(item);
        }
    }

    /**
     * @param {number} zoom
     * @return {HTMLCanvasElement}
     */
    getCanvas(zoom) {
        if (!this.canvas.has(zoom)) {
            this.canvas.set(zoom, this.renderCache(zoom));
        }

        return this.canvas.get(zoom);
    }

    renderLine(line, strokeStyle, globalCompositeOperation = 'source-over') {
        this.canvas.forEach((canvas, zoom) => {
            let context = canvas.getContext('2d');

            context.globalCompositeOperation = globalCompositeOperation;
            context.strokeStyle = strokeStyle;

            line.renderCache(context, this.x * zoom, this.y * zoom, zoom);
        });
    }

    /**
     * @param {number} zoom
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

        let offsetLeft = this.x * zoom;
        let offsetTop = this.y * zoom;

        for (let i = this.scenery.length - 1; i >= 0; --i) {
            let sceneryLine = this.scenery[i];
            context.moveTo(sceneryLine.pos.x * zoom - offsetLeft, sceneryLine.pos.y * zoom - offsetTop);
            context.lineTo(sceneryLine.endPos.x * zoom - offsetLeft, sceneryLine.endPos.y * zoom - offsetTop);
        }
        context.stroke();

        context.beginPath();
        context.strokeStyle = '#000';
        for (let i = this.lines.length - 1; i >= 0; --i) {
            let line = this.lines[i];
            context.moveTo(line.pos.x * zoom - offsetLeft, line.pos.y * zoom - offsetTop);
            context.lineTo(line.endPos.x * zoom - offsetLeft, line.endPos.y * zoom - offsetTop);
        }
        context.stroke();

        return canvas;
    }
}
