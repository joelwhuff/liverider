export default class DefaultActiveMessage {
    static 'join'(sender, data) {
        if (sender.server.hasRoom(data)) {
            sender.send(
                JSON.stringify({
                    type: 'join',
                    data: { user: { name: sender.name, color: sender.color } },
                })
            );

            sender.server.addClientToRoom(sender, data);
        }
    }
}
