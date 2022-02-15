import GameState from './GameState.js';
import TrackParser from '../parser/TrackParser.js';
import EmptyRoom from '../room/empty/EmptyRoom.js';

export default class ParserState extends GameState {
    onEnter() {
        this.getTrackParser();
    }

    getTrackParser() {
        this.manager.game.ui.clearUI(this);
        this.track.canvas.style.cursor = 'default';

        // if(in collab room) this.parser = new TrackBufferParser(this.track)
        this.parser = new TrackParser(this.track);
        this.parser.init(this.track.getRawTrack());
    }

    initUI() {
        if (this.track.room instanceof EmptyRoom) {
            this.manager.game.ui.createEditorUI(this);
        } else {
            this.manager.game.ui.createRaceUI(this);
        }
    }

    fixedUpdate() {}

    update() {
        this.parser.currentStep();

        this.parser.progress =
            this.parser.solidLineData.index + this.parser.sceneryLineData.index + this.parser.itemData.index;
        if (this.parser.done) {
            this.manager.room.sendJSON({ type: 'parserdone' });
            this.manager.room.setMessageParser('active');
            this.manager.push('track');
            this.initUI();
        }
    }

    render(ctx) {
        let barY = this.track.canvas.height / 2 - 15;
        let barW = this.track.canvas.width - 200;

        ctx.clearRect(0, 0, this.track.canvas.width, this.track.canvas.height);

        ctx.fillStyle = '#ccc';
        ctx.fillRect(100, barY, barW, 30);

        ctx.fillStyle = '#aaa';
        ctx.fillRect(100, barY, (this.parser.progress / this.parser.length) * barW, 30);
        ctx.strokeRect(99, barY - 1, barW - 1, 32);

        let progressText = `Parsing ${this.parser.progressLabel}: ${Math.round(
            (this.parser.progress / this.parser.length) * 100
        )} %`;
        let progressTextMetrics = ctx.measureText(progressText);
        let progressTextWidth = progressTextMetrics.width;
        let progressTextHeight =
            progressTextMetrics.actualBoundingBoxAscent + progressTextMetrics.actualBoundingBoxDescent;
        ctx.fillStyle = '#000';
        ctx.fillText(
            progressText,
            (this.track.canvas.width - progressTextWidth) / 2,
            (this.track.canvas.height + progressTextHeight) / 2
        );
    }
}
