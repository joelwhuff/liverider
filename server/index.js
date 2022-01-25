import { createServer } from 'http';

import GameServer from './lib/GameServer.js';
import RaceRoom from './lib/room/RaceRoom.js';

let blacklist = new Array();

let httpServer = createServer();

let gameServer = new GameServer({ noServer: true, clientTracking: false });
gameServer.init();
gameServer.addRoom(new RaceRoom());

httpServer.on('upgrade', (req, socket, head) => {
    if (blacklist.includes(socket.remoteAddress)) {
        socket.destroy();
        return;
    }

    gameServer.handleUpgrade(req, socket, head, (ws, req) => {
        gameServer.emit('connection', ws, req);
    });
});

httpServer.listen(80, () => {
    console.log('listening on port 80');
});
