import RaceActiveMessage from './RaceActiveMessage.js';
import { KEY_PRESSED, TIME, PARSER_DONE } from '../constant/MessageConstants.js';

export default class RaceLoadingMessage extends RaceActiveMessage {
    static [KEY_PRESSED]() {}

    static [TIME]() {}

    static [PARSER_DONE](room, sender) {
        room.deleteLoadingClient(sender.id);

        if (room.state.name !== 'stage3PreRace') {
            if (room.state.name !== 'stage4Racing') {
                sender.stopped = false;
            }
        } else if (!room.loadingClients.length) {
            room.stage4Racing();
        }

        let buf = new ArrayBuffer(4);
        new Uint8Array(buf, 0, 1)[0] = TIME;
        new Uint16Array(buf, 2)[0] = sender.id;
        room.broadcastExcludeClients(buf, room.loadingClients.concat(sender.id));

        if (!sender.spectating) {
            room.broadcastExcludeClients(
                JSON.stringify({ type: 'addrunner', data: { id: sender.id, stopped: sender.stopped } }),
                room.loadingClients.concat(sender.id)
            );
        }

        if (room.state.name === 'stage1Lobby' && room.clients.size >= 2) {
            room.stage2LobbyCountdown();
        }

        sender.setMessageParser(room.constructor.messageStages.get('active'));
    }
}
