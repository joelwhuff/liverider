export default class Room {
    constructor(server) {
        this.server = server;

        this.clients = new Map();
        this.clientId = 0;
    }

    addClient(client) {
        client.id = this.clientId++;
        this.clients.set(client.id, client);

        client.room = this;
    }

    deleteClient(clientId) {
        this.clients.delete(clientId);
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

    sendToClient(clientId, msg) {
        this.clients.get(clientId).send(msg);
    }
}
