import Room from '../Room.js';
import RaceMessage from './RaceMessage.js';

export default class RaceRoom extends Room {
    static get messageParser() {
        return RaceMessage;
    }
}
