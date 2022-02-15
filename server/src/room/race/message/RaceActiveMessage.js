import { KEY_PRESSED } from '../constant/MessageConstants.js';

export default class RaceActiveMessage {
    static [KEY_PRESSED](sender, data) {
        sender.room.broadcastExcludeClients(
            new Float64Array([KEY_PRESSED, sender.id, data[0], data[1]]),
            sender.room.loadingClients.concat(sender.id)
        );
        sender.keyLog[data[0]].push(data[1]);
    }

    static 'time'(sender, data) {
        sender.room.sendToClient(
            JSON.stringify({
                type: 'keylog',
                data: {
                    id: sender.id,
                    time: data.time,
                    stopped: sender.stopped,
                    keys: {
                        upPressed: sender.keyLog[0],
                        downPressed: sender.keyLog[1],
                        leftPressed: sender.keyLog[2],
                        rightPressed: sender.keyLog[3],
                        turnPressed: sender.keyLog[4],
                    },
                    restartPressed: sender.keyLog[5],
                    cancelPressed: sender.keyLog[6],
                    pausePressed: sender.keyLog[7],
                    unpausePressed: sender.keyLog[8],
                    switchBikePressed: sender.keyLog[9],
                },
            }),
            data.id
        );
    }

    static 'finish'(sender, data) {
        sender.finalTime = data;

        if (sender.room.state.name === 'stage4Racing') {
            sender.room.stage5RaceEnd(sender.name);
        }
    }

    static 'unstop'(sender) {
        sender.stopped = false;
        sender.room.broadcastExcludeClients(
            JSON.stringify({ type: 'unstop', data: sender.id }),
            sender.room.loadingClients.concat(sender.id)
        );
    }

    static 'message'(sender, data) {
        sender.room.broadcastExcludeClients(JSON.stringify({ type: 'message', data: { id: sender.id, text: data } }), [
            sender.id,
        ]);
    }
}
