import { KEY_PRESSED, TIME, UNSTOP, FINISH } from '../constant/MessageConstants.js';

export default class RaceActiveMessage {
    static [KEY_PRESSED](room, sender, data) {
        room.broadcastExcludeClients(
            new Float64Array([KEY_PRESSED, sender.id, data[0], data[1]]),
            room.loadingClients.concat(sender.id)
        );
        sender.keyLog[data[0]].push(data[1]);
    }

    static [TIME](room, sender, data) {
        room.sendToClient(
            JSON.stringify({
                type: 'keylog',
                data: {
                    id: sender.id,
                    time: data[1],
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
            data[0]
        );
    }

    static [UNSTOP](room, sender) {
        sender.stopped = false;
        room.broadcastExcludeClients(new Float64Array([UNSTOP, sender.id]), room.loadingClients.concat(sender.id));
    }

    static 'finish'(room, sender, data) {
        sender.finalTime = data;

        if (room.state.name === 'stage4Racing') {
            room.stage5RaceEnd(sender.name);
        }
    }

    static 'message'(room, sender, data) {
        room.broadcastExcludeClients(JSON.stringify({ type: 'message', data: { id: sender.id, text: data } }), [
            sender.id,
        ]);
    }
}
