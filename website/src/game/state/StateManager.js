import GameObject from '../GameObject.js';
import Track from '../track/Track.js';
import GameState from './GameState.js';
import RaceRoom from '../room/race/RaceRoom.js';
import EmptyRoom from '../room/empty/EmptyRoom.js';

export default class StateManager extends GameObject {
    constructor(game, canvas, opt) {
        super();

        this.game = game;

        if (opt.ws) {
            this.room = new RaceRoom(this, opt.ws);
        } else {
            this.room = new EmptyRoom();
        }
        opt.room = this.room;

        this.track = new Track(canvas, opt);

        /** @type {Map<String, GameState>} */
        this.states = new Map();
        /** @type {Array<GameState>} */
        this.stateStack = [];
    }

    push(name) {
        let state = this.getState(name);
        state.onEnter();
        this.stateStack.push(state);
    }

    pop() {
        if (this.stateStack.length) {
            this.getCurrent().onLeave();
            return this.stateStack.pop();
        }

        return null;
    }

    /**
     *
     * @param {GameState} stateClass
     * @param {String} name
     */
    addState(stateClass, name) {
        let state = new stateClass(this);
        this.states.set(name, state);
    }

    getState(name) {
        return this.states.get(name);
    }

    fixedUpdate() {
        if (this.stateStack.length) {
            this.getCurrent().fixedUpdate();
        }
    }

    update(progress, delta) {
        if (this.stateStack.length) {
            this.getCurrent().update(progress, delta);
        }
    }

    render(ctx) {
        if (this.stateStack.length) {
            this.getCurrent().render(ctx);
        }
    }

    getCurrent() {
        return this.stateStack[this.stateStack.length - 1];
    }
}
