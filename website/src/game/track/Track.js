import GhostRunner from '../bike/GhostRunner.js';
import SocketRunner from '../bike/GhostRunner.js';
import BMX from '../bike/instance/BMX.js';
import PlayerRunner from '../bike/PlayerRunner.js';
import { CACHE_CELL_SIZE, GRID_CELL_SIZE } from '../constant/GridConstants.js';
import { MAX_LINE_LENGTH, MAX_ZOOM, MIN_LINE_LENGTH, MIN_ZOOM, TRACK_DEFAULT } from '../constant/TrackConstants.js';
import Entity from '../entity/Entity.js';
import PhysicsCell from '../grid/cell/PhysicsCell.js';
import RenderCell from '../grid/cell/RenderCell.js';
import Grid from '../grid/Grid.js';
import UndoManager from '../history/UndoManager.js';
import Item from '../item/Item.js';
import Line from '../item/line/Line.js';
import ReachableItem from '../item/ReachableItem.js';
import Vector from '../numeric/Vector.js';
import ToolManager from '../tool/manager/ToolManager.js';
import PauseTool from '../tool/PauseTool.js';
import ToolCollection from '../tool/ToolCollection.js';
import TrackEvent from './TrackEvent.js';

export default class Track {
    /**
     * @param {{}} opt
     */
    constructor(canvas, opt = {}) {
        /** @type {HTMLCanvasElement} */
        this.canvas = canvas;
        /** @type {string} */
        this.trackCode = opt.trackCode;

        this.room = opt.room;

        this.event = new TrackEvent(this);

        this.toolManager = new ToolManager(this);

        /** @type {number} */
        this.zoomFactor = 0.6;
        this.camera = new Vector();
        this.origin = new Vector();

        this.focalPoint = new Entity(new Vector(), new Vector());

        this.mousePos = new Vector();
        this.lastClick = new Vector();
        this.gridDetail = 1;

        this.grid = new Grid(GRID_CELL_SIZE, PhysicsCell, this);

        this.cache = new Grid(CACHE_CELL_SIZE, RenderCell, this);

        this.checkpoints = new Map();
        this.targets = new Map();

        this.toolCollection = new ToolCollection();
        this.paused = false;
        this.stopped = false;
        this.time = 0;

        this.user = opt.user || { name: 'me', color: '#000' };
        this.spectating = opt.spectating;

        this.bikeClass = null;
        this.playerRunner = new PlayerRunner(this, BMX, this.user.name, this.user.color);
        /** @type {Array<GhostRunner>} */
        this.ghostRunners = new Array();
        /** @type {Map<string, SocketRunner>} */
        this.socketRunners = new Map();

        this.undoManager = new UndoManager();
    }

    getRawTrack() {
        let rawTrack = TRACK_DEFAULT;

        if (this.trackCode) {
            rawTrack = this.trackCode;
        }

        this.trackCode = null;

        return rawTrack;
    }

    /**
     * @param {Vector} point
     * @param {number} direction
     */
    zoom(point, direction) {
        let px = point.toPixel(this);
        this.zoomFactor = parseFloat(
            Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, this.zoomFactor + 0.2 * direction)).toFixed(2)
        );
        this.camera.x = point.x - (px.x - this.canvas.width / 2) / this.zoomFactor;
        this.camera.y = point.y - (px.y - this.canvas.height / 2) / this.zoomFactor;
    }

    /**
     *
     * @param {Item} item
     */
    remove(item) {
        item.grid.remove(item);
        item.cache.remove(item);
    }

    /**
     *
     * @param {Item} item
     * @param {Grid} grid
     * @param {Grid} cache
     */
    add(item, grid, cache) {
        if (!(item instanceof Line) || (item.len >= MIN_LINE_LENGTH && item.len < MAX_LINE_LENGTH)) {
            grid.add(item);
            cache.add(item);
        }

        return item;
    }

    /**
     *
     * @param {Entity} part
     */
    touch(part) {
        let x = Math.floor(part.pos.x / this.grid.cellSize - 0.5);
        let y = Math.floor(part.pos.y / this.grid.cellSize - 0.5);

        this.grid.cell(x, y).untouch();
        this.grid.cell(x, y + 1).untouch();
        this.grid.cell(x + 1, y).untouch();
        this.grid.cell(x + 1, y + 1).untouch();

        this.grid.cell(x, y).touch(part);
        this.grid.cell(x + 1, y).touch(part);
        this.grid.cell(x + 1, y + 1).touch(part);
        this.grid.cell(x, y + 1).touch(part);
    }

    checkDelete(eraserPoint, radius, restrict) {
        let x = Math.floor(eraserPoint.x / this.grid.cellSize - 0.5),
            y = Math.floor(eraserPoint.y / this.grid.cellSize - 0.5),
            deleted = new Array();

        const checkCell = (cell, restrict) => {
            deleted.push(...cell.checkDelete(eraserPoint, radius, restrict));
        };

        if ([...restrict.values()].some(Boolean)) {
            checkCell(this.grid.cell(x, y), restrict);
            checkCell(this.grid.cell(x, y + 1), restrict);
            checkCell(this.grid.cell(x + 1, y), restrict);
            checkCell(this.grid.cell(x + 1, y + 1), restrict);
        }

        return deleted;
    }

    unreachEverything() {
        this.grid.cells.forEach((cell, key) => {
            for (let object of cell.objects) {
                if (object instanceof ReachableItem) {
                    object.reached = false;
                }
            }
        });
    }

    pause(paused) {
        if (!this.stopped) {
            this.room.sendKeyPress(paused ? 7 : 8, this.time);
            this.paused = paused;
            this.toolCollection.getByToolName(PauseTool.toolName).updateDOM();
        }
    }

    restart() {
        this.unreachEverything();
        this.pause(false);

        this.playerRunner.restart();
        this.ghostRunners.forEach(runner => {
            runner.restart();
        });

        this.focalPoint = this.playerRunner.instance.hitbox;
        if (!this.playerRunner.snapshots.length && this.ghostRunners.length) {
            this.focalPoint = this.ghostRunners[0].instance.hitbox;
        }

        this.camera.set(this.focalPoint.displayPos);
    }
}
