export default class RaceInitializationMessage {
    static 'ready'(sender, data) {
        sender.send(
            JSON.stringify({
                type: 'trackdata',
                data: sender.room.constructor.LOBBY_TRACK_CODE,
            })
        );
    }

    static 'parserdone'(sender, data) {
        let userData = [];
        sender.room.clients.forEach(client => {
            userData.push({ id: client.id, name: client.name, color: client.color });
        });
        sender.send(JSON.stringify({ type: 'users', data: userData }));

        sender.room.broadcastExcludeClient(
            sender.id,
            JSON.stringify({ type: 'adduser', data: { id: sender.id, name: sender.name, color: sender.color } })
        );

        sender.room.broadcastExcludeClient(sender.id, JSON.stringify({ type: 'time', data: sender.id }));

        sender.setMessageParser(sender.room.constructor.messageStages.get('active'));
    }
}
