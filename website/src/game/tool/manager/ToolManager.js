import GameObject from '../../GameObject.js';
import Track from '../../track/Track.js';
import CameraTool from '../CameraTool.js';
import Tool from '../Tool.js';

export default class ToolManager extends GameObject {
    constructor(track) {
        super();
        /** @type {Track} */
        this.track = track;
        this.tool = null;
        this.rightTool = new CameraTool(this.track);
        this.active = false;
        this.optionsOpened = false;
    }

    /**
     *
     * @param {Tool} tool
     */
    setTool(tool) {
        if (this.tool) {
            this.tool.deactivate();
        }

        this.tool = tool;
        this.tool.activate();
    }

    fixedUpdate() {
        if (this.tool && this.active) {
            this.tool.fixedUpdate();
        }
    }

    update(progress, delta) {
        if (this.tool && this.active) {
            this.tool.update(progress, delta);
        }
    }

    render(ctx) {
        if ((this.track.event.mouseIn && this.tool && this.active) || (this.tool && this.tool.alwaysRender)) {
            this.tool.render(ctx);
        }
    }

    onMouseDown(e) {
        if (this.tool && e.button === 0) {
            this.active = true;
            this.tool.onMouseDown(e);
        }
        if (this.rightTool && e.button === 2) {
            this.rightTool.mouseDown = true;
        }
    }

    onMouseUp(e) {
        if (this.tool && e.button === 0) {
            this.active = true;
            this.tool.onMouseUp(e);
        }
        if (this.rightTool && e.button === 2) {
            this.rightTool.mouseDown = false;
        }
    }

    onMouseMove(e) {
        if (this.tool) {
            this.active = true;
            this.tool.onMouseMove(e);
        }
        if (this.rightTool) {
            this.rightTool.onMouseMove(e);
        }
    }

    onScroll(e) {
        if (this.tool) {
            this.active = true;
            this.tool.onScroll(e);
        }
    }

    onContextMenu(e) {
        if (this.tool) {
            this.active = true;
        }
    }
}
