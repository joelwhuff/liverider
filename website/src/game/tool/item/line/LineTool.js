import { SCENERY_SVG, SOLID_SVG } from '../../../constant/ToolConstants.js';
import { MAX_LINE_LENGTH, MIN_LINE_LENGTH } from '../../../constant/TrackConstants.js';
import { SOLID_LINE_SVG } from '../../../constant/ToolConstants.js';
import Line from '../../../item/line/Line.js';
import SolidLine from '../../../item/line/SolidLine.js';
import LinePath from '../../../numeric/LinePath.js';
import Vector from '../../../numeric/Vector.js';
import Tool from '../../Tool.js';
import * as KeyCode from '../../../keyboard/KeyCode.js';
import Control from '../../../keyboard/Control.js';
import SceneryLine from '../../../item/line/SceneryLine.js';

export default class LineTool extends Tool {
    static get toolName() {
        return 'Line';
    }
    static get keyLabel() {
        return 'Q';
    }
    static get key() {
        return new Control(KeyCode.DOM_VK_Q);
    }
    static get icon() {
        return SOLID_LINE_SVG;
    }

    constructor(track) {
        super(track);
        this.foreground = false;
        this.lastLine = new Vector(40, 50);
        this.lineClass = SolidLine;

        this.makeOptions();
    }

    onMouseDown(e) {
        if (this.isHolding()) {
            this.addLine(this.lastLine);
        } else if (e.button !== 2) {
            this.mouseDown = true;
        }
    }

    onMouseUp(e) {
        if (!this.mouseDown) return;

        this.mouseDown = false;

        if (!this.isHolding()) {
            this.addLine(this.track.lastClick);
        }
    }

    addLine(startPos) {
        // let lineClass = this.constructor.lineClass;
        let lineClass = this.lineClass;
        let line = new lineClass(startPos.clone(), this.track.mousePos.clone(), this.track);
        line.grid = this.track.grid;
        line.cache = this.track.cache;

        line.addToTrack();

        this.track.undoManager.push({
            undo: () => line.removeFromTrack(),
            redo: () => line.addToTrack(),
        });

        this.lastLine = this.track.mousePos.clone();
    }

    checkLineLength() {
        let measure = Math.max(
            Math.abs(this.track.lastClick.x - this.track.mousePos.x),
            Math.abs(this.track.lastClick.y - this.track.mousePos.y)
        );

        return measure >= MIN_LINE_LENGTH && measure < MAX_LINE_LENGTH;
    }

    makeOptions() {
        // make options once when tool is added to toolbar, then add class for hidden/open

        this.optionsEl = document.createElement('div');
        this.optionsEl.id = 'tool-options';
        this.optionsEl.addEventListener('contextmenu', e => {
            e.preventDefault();
        });

        let solid = document.createElement('div');
        solid.classList.add('tool', 'option');
        solid.innerHTML = SOLID_SVG;

        let scenery = document.createElement('div');
        scenery.classList.add('tool', 'option');
        scenery.innerHTML = SCENERY_SVG;

        let setSolid = () => {
            this.lineClass = SolidLine;
            scenery.classList.remove('selected');
            solid.classList.add('selected');
        };
        let setScenery = () => {
            this.lineClass = SceneryLine;
            solid.classList.remove('selected');
            scenery.classList.add('selected');
        };

        let toggleLineClass = () => {
            if (this.track.toolManager.tool === this) {
                if (this.lineClass === SolidLine) {
                    setScenery();
                } else {
                    setSolid();
                }
            }
        };

        this.lineClass === SceneryLine ? setScenery() : setSolid();

        solid.addEventListener('click', setSolid);
        scenery.addEventListener('click', setScenery);
        document.addEventListener('keydown', e => {
            if (this.track.event.gameInFocus && e.key.toLowerCase() === 's') {
                toggleLineClass();
            }
        });

        this.optionsEl.append(solid, scenery);
    }

    update(progress, delta) {
        if (this.mouseDown || this.isHolding()) {
            let mousePx = this.track.mousePos.toPixel(this.track);
            let deltaVec = new Vector();
            let deltaFactor = delta / 4 / this.track.zoomFactor;

            if (mousePx.x < 50) {
                deltaVec.x = -deltaFactor;
            } else if (mousePx.x > this.track.canvas.width - 50) {
                deltaVec.x = deltaFactor;
            }

            if (mousePx.y < 50) {
                deltaVec.y = -deltaFactor;
            } else if (mousePx.y > this.track.canvas.height - 50) {
                deltaVec.y = deltaFactor;
            }

            this.track.camera.selfAdd(deltaVec);
            this.track.mousePos.selfAdd(deltaVec);
        }
    }

    render(ctx) {
        let mousePx = this.track.mousePos.toPixel(this.track);

        // ctx.lineWidth = 2;
        // ctx.strokeStyle = '#000';
        // ctx.lineCap = 'round';

        // ctx.beginPath();
        // ctx.moveTo(mousePx.x - 10, mousePx.y);
        // ctx.lineTo(mousePx.x + 10, mousePx.y);
        // ctx.moveTo(mousePx.x, mousePx.y - 10);
        // ctx.lineTo(mousePx.x, mousePx.y + 10);
        // ctx.stroke();

        if (this.mouseDown || this.isHolding()) {
            this.renderLineInfo(ctx, mousePx);
        }

        ctx.beginPath();
        ctx.fillStyle = '#48f';
        ctx.arc(mousePx.x, mousePx.y, this.track.zoomFactor, 0, Math.PI * 2);
        ctx.fill();

        this.renderLineSize(ctx, mousePx);
    }

    renderLineSize(ctx, mousePx) {}

    renderLineInfo(ctx, mousePx) {
        ctx.strokeStyle = this.lineClass === SolidLine ? '#000' : '#aaa';
        ctx.lineWidth = this.track.zoomFactor * 2;

        let startPos = this.isHolding() ? this.lastLine : this.track.lastClick;

        LinePath.render(ctx, [[startPos.toPixel(this.track), mousePx]]);

        // let length = startPos.distanceTo(this.track.mousePos);
        // let distance = this.track.mousePos.sub(startPos);
        // let angle = (-Math.atan2(distance.y, distance.x) / Math.PI) * 180;

        // ctx.lineWidth = 0.5;
        // ctx.fillStyle = '#777';
        // ctx.fillText(Math.round(length), mousePx.x + 3, mousePx.y - 3);

        // ctx.textAlign = 'right';
        // ctx.fillText(Math.round(angle) + '°', mousePx.x - 3, mousePx.y - 3);
        // ctx.textAlign = 'left';
    }
}
