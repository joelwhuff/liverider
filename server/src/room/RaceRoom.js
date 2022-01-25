import Room from './Room.js';

export default class RaceRoom extends Room {
    parseMessage(type, data, senderClient) {
        switch (type) {
            case 0:
                this.broadcastExcludeClient(
                    senderClient.id,
                    new Float64Array([type, senderClient.id, data[0], data[1]])
                );
                senderClient.keyLog.get(data[0]).push(data[1]);
                break;
            case 1:
                this.broadcastExcludeClient(senderClient.id, new Float64Array([type, senderClient.id, data[0]]));
                senderClient.restartPressed.push(data[0]);
                break;
            case 2:
                this.broadcastExcludeClient(senderClient.id, new Float64Array([type, senderClient.id, data[0]]));
                senderClient.cancelPressed.push(data[0]);
                break;
            case 3:
                this.broadcastExcludeClient(senderClient.id, new Float64Array([type, senderClient.id, data[0]]));
                senderClient.pausePressed.push(data[0]);
                break;
            case 4:
                this.broadcastExcludeClient(senderClient.id, new Float64Array([type, senderClient.id, data[0]]));
                senderClient.unpausePressed.push(data[0]);
                break;
            case 5:
                this.broadcastExcludeClient(senderClient.id, new Float64Array([type, senderClient.id, data[0]]));
                senderClient.switchBikePressed.push(data[0]);
                break;
            case 'time':
                this.clients.get(data.id).sendJSON({
                    type: 'keylog',
                    data: {
                        id: senderClient.id,
                        time: data.time,
                        bike: data.bike,
                        keys: {
                            upPressed: senderClient.keyLog.get(0),
                            downPressed: senderClient.keyLog.get(1),
                            leftPressed: senderClient.keyLog.get(2),
                            rightPressed: senderClient.keyLog.get(3),
                            turnPressed: senderClient.keyLog.get(4),
                        },
                        restartPressed: senderClient.restartPressed,
                        cancelPressed: senderClient.cancelPressed,
                        pausePressed: senderClient.pausePressed,
                        unpausePressed: senderClient.unpausePressed,
                        switchBikePressed: senderClient.switchBikePressed,
                    },
                });
                break;
            case 'parser_done': {
                // dont really need to wait until parser is done for most of this I guess
                let userData = [];
                this.clients.forEach(client => {
                    userData.push({ id: client.id, info: client.info });
                });
                senderClient.sendJSON({ type: 'users', data: userData });

                this.broadcastExcludeClient(senderClient.id, JSON.stringify({ type: 'time', data: senderClient.id }));

                this.broadcastExcludeClient(
                    senderClient.id,
                    JSON.stringify({ type: 'new_user', data: { id: senderClient.id, info: senderClient.info } })
                );
                break;
            }
            default:
                client.destroy();
        }
    }
}
