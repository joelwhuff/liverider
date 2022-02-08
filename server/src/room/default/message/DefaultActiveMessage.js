export default class DefaultActiveMessage {
    static 'join'(sender, data) {
        if (sender.server.hasRoom(data)) {
            sender.server.addClientToRoom(sender, data);
        }
    }
}
