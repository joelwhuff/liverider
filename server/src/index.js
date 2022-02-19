import { createServer } from 'https';
import { readFileSync } from 'fs';

import GameServer from './core/GameServer.js';
import BrowserRoom from './room/browser/BrowserRoom.js';
import RaceRoom from './room/race/RaceRoom.js';

let httpServer = createServer({
    key: readFileSync(`/etc/letsencrypt/live/${process.env.NAME}.liverider.app/privkey.pem`),
    cert: readFileSync(`/etc/letsencrypt/live/${process.env.NAME}.liverider.app/fullchain.pem`),
});

let gameServer = new GameServer({ noServer: true, clientTracking: false });
gameServer.init();
gameServer.addRoom(new BrowserRoom(gameServer));
gameServer.addRoom(new RaceRoom(gameServer));

httpServer.on('upgrade', (req, socket, head) => {
    if (GameServer.blacklist.includes(socket.remoteAddress)) {
        socket.destroy();
        return;
    }

    gameServer.wss.handleUpgrade(req, socket, head, (ws, req) => {
        gameServer.wss.emit('connection', ws, req);
    });
});

httpServer.listen(443, () => {
    console.log('listening on port 443');
});
