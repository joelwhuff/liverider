import RaceActiveMessage from './RaceActiveMessage.js';
import { KEY_PRESSED } from '../constant/MessageConstants.js';

export default class RaceLoadingMessage extends RaceActiveMessage {
    static [KEY_PRESSED]() {}

    static 'time'() {}

    static 'parserdone'(sender) {
        sender.room.deleteLoadingClient(sender.id);

        if (sender.room.state.name !== 'stage3PreRace') {
            sender.stopped = false;
        } else if (!sender.room.loadingClients.length) {
            sender.room.stage4Racing();
        }

        sender.room.broadcastExcludeClients(
            JSON.stringify({ type: 'time', data: sender.id }),
            sender.room.loadingClients.concat(sender.id)
        );

        sender.room.broadcastExcludeClients(
            JSON.stringify({ type: 'addrunner', data: { id: sender.id, stopped: sender.stopped } }),
            sender.room.loadingClients.concat(sender.id)
        );

        sender.setMessageParser(sender.room.constructor.messageStages.get('active'));

        if (sender.room.state.name === 'stage1Lobby' && sender.room.clients.size >= 2) {
            sender.room.stage2LobbyCountdown();
        }
    }
}
