import { KEY_PRESSED, TIME, UNSTOP, FINISH } from '../constant/RaceMessageConstants.js';

export default class RaceActiveMessage {
    static [KEY_PRESSED](room, sender, data) {
        new Uint16Array(data, 2, 1)[0] = sender.id;

        room.broadcastExcludeClients(data, room.loadingClients.concat(sender.id));

        sender.keyLog[new Uint8Array(data, 1, 1)[0]].push(new Uint32Array(data, 4)[0]);
    }

    static [TIME](room, sender, data) {
        room.sendToClient(
            JSON.stringify({
                type: 'keylog',
                data: {
                    id: sender.id,
                    time: new Uint32Array(data, 4)[0],
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
            new Uint16Array(data, 2, 1)[0]
        );
    }

    static [UNSTOP](room, sender) {
        let buf = new ArrayBuffer(4);
        new Uint8Array(buf, 0, 1)[0] = UNSTOP;
        new Uint16Array(buf, 2)[0] = sender.id;

        room.broadcastExcludeClients(buf, room.loadingClients.concat(sender.id));

        sender.stopped = false;
    }

    static [FINISH](room, sender, data) {
        sender.finalTime = new Uint32Array(data, 4)[0];

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
