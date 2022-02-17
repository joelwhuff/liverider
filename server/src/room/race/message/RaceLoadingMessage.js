import RaceActiveMessage from './RaceActiveMessage.js';
import { KEY_PRESSED, TIME } from '../constant/MessageConstants.js';

export default class RaceLoadingMessage extends RaceActiveMessage {
    static [KEY_PRESSED]() {}

    static [TIME]() {}

    static 'parserdone'(room, sender) {
        room.deleteLoadingClient(sender.id);

        if (room.state.name !== 'stage3PreRace') {
            if (room.state.name !== 'stage4Racing') {
                sender.stopped = false;
            }
        } else if (!room.loadingClients.length) {
            room.stage4Racing();
        }

        room.broadcastExcludeClients(new Float64Array([TIME, sender.id]), room.loadingClients.concat(sender.id));

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
