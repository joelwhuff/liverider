export default class Room {
    constructor() {
        this.clients = new Map();
        this.clientId = 0;
    }

    addClient(client) {
        let id = this.clientId++;
        client.id = id;
        client.info.name = 'user' + id;
        this.clients.set(id, client);
    }

    deleteClient(id) {
        this.clients.delete(id);
        this.broadcast(JSON.stringify({ type: 'user_dc', data: id }));
    }

    broadcast(msg) {
        this.clients.forEach(client => {
            client.send(msg);
        });
    }

    broadcastExcludeClient(clientId, msg) {
        this.clients.forEach((client, id) => {
            if (id !== clientId) {
                client.send(msg);
            }
        });
    }
}
