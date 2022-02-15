import GameServer from '../core/GameServer.js';

export default class Room {
    /**
     * @param {GameServer} server
     * @param {Object} [options]
     * @param {string} [options.password]
     */
    constructor(server, options) {
        options = { password: null, ...options };

        this.server = server;

        this.clients = new Map();
        this.clientId = 0;
    }

    addClient(client) {
        client.id = this.clientId++;
        this.clients.set(client.id, client);

        client.room = this;
    }

    deleteClient(id) {
        this.clients.delete(id);
    }

    /**
     * @param {(string|ArrayBuffer)} msg
     */
    broadcast(msg) {
        this.clients.forEach(client => {
            client.send(msg);
        });
    }

    /**
     * @param {(string|ArrayBuffer)} msg
     * @param {number[]} ids
     */
    broadcastExcludeClients(msg, ids) {
        this.clients.forEach((client, id) => {
            if (!ids.includes(id)) {
                client.send(msg);
            }
        });
    }

    /**
     * @param {(string|ArrayBuffer)} msg
     * @param {number} id
     */
    sendToClient(msg, id) {
        this.clients.get(id).send(msg);
    }

    getClientsInfo() {
        return [...this.clients.values()].map(client => ({ id: client.id, name: client.name, color: client.color }));
    }
}
