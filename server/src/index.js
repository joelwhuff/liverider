import { createServer } from 'http';

import GameServer from './core/GameServer.js';
import DefaultRoom from './room/default/DefaultRoom.js';
import RaceRoom from './room/race/RaceRoom.js';

let httpServer = createServer();

let gameServer = new GameServer({ noServer: true, clientTracking: false });
gameServer.init();
gameServer.addRoom(new DefaultRoom(gameServer));
gameServer.addRoom(new RaceRoom(gameServer));

httpServer.on('upgrade', (req, socket, head) => {
    if (gameServer.blacklist.includes(socket.remoteAddress)) {
        socket.destroy();
        return;
    }

    gameServer.wss.handleUpgrade(req, socket, head, (ws, req) => {
        gameServer.wss.emit('connection', ws, req);
    });
});

httpServer.listen(80, () => {
    console.log('listening on port 80');
});
