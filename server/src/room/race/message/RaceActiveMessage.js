export default class RaceActiveMessage {
    static 0(sender, data) {
        sender.room.broadcastExcludeClient(sender.id, new Float64Array([0, sender.id, data[0], data[1]]));
        sender.keyLog[data[0]].push(data[1]);
    }

    static 'time'(sender, data) {
        sender.room.sendToClient(
            data.id,
            JSON.stringify({
                type: 'keylog',
                data: {
                    id: sender.id,
                    time: data.time,
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
            })
        );
    }

    static 'message'(sender, data) {
        sender.room.broadcastExcludeClient(
            sender.id,
            JSON.stringify({ type: 'message', data: { id: sender.id, text: data } })
        );
    }
}
