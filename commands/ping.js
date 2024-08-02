module.exports = {
    name: 'ping',
    description: 'Ping the bot to check its latency to Discord.',
    execute(message, args, client) {
        message.reply(`Pong! Latency is \`${client.ws.ping}\`ms.`);
    },
};