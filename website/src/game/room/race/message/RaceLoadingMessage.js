import RaceActiveMessage from './RaceActiveMessage.js';
import { KEY_PRESSED, TIME, UNSTOP } from '../../../constant/RoomConstants.js';

export default class RaceLoadingMessage extends RaceActiveMessage {
    static [KEY_PRESSED](room, data) {}

    static [TIME](room, data) {}

    static [UNSTOP](room, data) {}

    static 'keylog'(room, data) {}

    static 'addrunner'(room, data) {}
}
