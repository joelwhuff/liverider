import fs from 'fs';
import { performance } from 'perf_hooks';

import Room from '../Room.js';
import RaceLoadingMessage from './message/RaceLoadingMessage.js';
import RaceActiveMessage from './message/RaceActiveMessage.js';

export default class RaceRoom extends Room {
    constructor(server) {
        super(server);

        this.loadingClients = new Array();

        this.state = new Object();

        this.timeout;
        this.delayStart = 0;

        this.stage1Lobby();
    }

    addClient(client) {
        client.send(JSON.stringify({ type: 'users', data: super.getClientsInfo() }));

        super.addClient(client);

        client.name ||= 'user' + client.id;

        super.broadcastExcludeClients(
            JSON.stringify({ type: 'adduser', data: { id: client.id, name: client.name, color: client.color } }),
            [client.id]
        );

        client.setMessageParser(this.constructor.messageStages.get('loading'));
        client.resetRaceProps();
        this.addLoadingClient(client.id);

        // if (this.state.name === 'stage3PreRace' || this.state.name === 'stage4Racing') {
        //     client.spectating = true;
        // }

        client.send(
            JSON.stringify({
                type: 'trackdata',
                data: {
                    trackCode: this.trackCode,
                    state: this.getState(),
                    user: { name: client.name, color: client.color },
                    spectating: client.spectating,
                },
            })
        );
    }

    deleteClient(id) {
        super.deleteClient(id);
        this.deleteLoadingClient(id);

        if (this.clients.size >= 1) {
            super.broadcast(JSON.stringify({ type: 'deleteuser', data: id }));
            if (this.clients.size === 1 && this.state.name === 'stage2LobbyCountdown') {
                this.stage1Lobby(false);
                super.broadcast(JSON.stringify({ type: 'state', data: this.state }));
            }
        } else {
            this.stage1Lobby();
        }
    }

    addLoadingClient(id) {
        if (!this.loadingClients.includes(id)) {
            this.loadingClients.push(id);
        }
    }

    deleteLoadingClient(id) {
        let index = this.loadingClients.indexOf(id);
        if (index !== -1) {
            this.loadingClients.splice(index, 1);
        }
    }

    getState() {
        if (this.state.delay) {
            let time = performance.now();
            this.state.delay -= Math.trunc(time - this.delayStart);
            this.delayStart = time;
        }

        return this.state;
    }

    resetPlayers() {
        this.clients.forEach(client => {
            client.setMessageParser(this.constructor.messageStages.get('loading'));
            client.resetRaceProps();
            this.addLoadingClient(client.id);
        });
    }

    stage1Lobby(reset = true) {
        clearTimeout(this.timeout);

        this.state = {
            name: 'stage1Lobby',
        };

        this.trackCode = this.constructor.LOBBY_TRACK_CODE;

        if (reset) {
            this.resetPlayers();

            super.broadcast(
                JSON.stringify({
                    type: 'trackdata',
                    data: {
                        trackCode: this.trackCode,
                        state: this.state,
                    },
                })
            );
        }
    }

    stage2LobbyCountdown() {
        this.state = {
            name: 'stage2LobbyCountdown',
            delay: 30000,
        };

        this.delayStart = performance.now();
        this.timeout = setTimeout(() => this.stage3PreRace(), this.state.delay + 300);

        super.broadcast(
            JSON.stringify({
                type: 'state',
                data: this.getState(),
            })
        );
    }

    stage3PreRace() {
        fs.readFile(`server/test_tracks/${Math.floor(Math.random() * 16)}.txt`, 'utf8', (err, data) => {
            if (err) console.log(err);

            this.state = { name: 'stage3PreRace' };

            this.trackCode = data;

            this.resetPlayers();

            super.broadcast(
                JSON.stringify({
                    type: 'trackdata',
                    data: {
                        trackCode: this.trackCode,
                        state: this.state,
                    },
                })
            );

            this.timeout = setTimeout(() => {
                if (this.state.name !== 'stage4Racing') {
                    this.stage4Racing();
                }
            }, 7000);
        });
    }

    stage4Racing() {
        this.state = { name: 'stage4Racing', delay: 5000 };

        this.delayStart = performance.now();
        super.broadcast(
            JSON.stringify({
                type: 'state',
                data: this.state,
            })
        );
    }

    stage5RaceEnd(winner) {
        this.state = { name: 'stage5RaceEnd', delay: 30000, winner };

        super.broadcast(
            JSON.stringify({
                type: 'state',
                data: this.state,
            })
        );

        this.delayStart = performance.now();
        this.timeout = setTimeout(() => {
            super.broadcast(JSON.stringify({ type: 'results', data: this.getRaceResults() }));
            this.timeout = setTimeout(() => {
                this.stage1Lobby();
            }, 4000);
        }, this.state.delay + 1000);
    }

    getRaceResults() {
        return [...this.clients.values()]
            .map(client => ({ id: client.id, finalTime: client.finalTime }))
            .sort((a, b) => a.finalTime - b.finalTime);
    }
}

RaceRoom.messageStages = new Map();
RaceRoom.messageStages.set('loading', RaceLoadingMessage);
RaceRoom.messageStages.set('active', RaceActiveMessage);

RaceRoom.LOBBY_TRACK_CODE = fs.readFileSync('server/test_tracks/mockba.txt', 'utf8');
