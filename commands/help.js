module.exports = {
    name: 'help',
    description: 'Shows a list of commands.',
    execute(message, args) {
        const helpMessage = [
            '> **UwUCoin Help**',
            '- `help` - Shows a list of commands.',
            '- `ping` - Shows the Latency of the bot.',
            '- `bal` - Shows your account balance.',
            '- `pay` - Send UwUCoins to a user.',
            '\t Usage: \`uwu!pay @user amoumt\`',
        ].join('\n');
        
        message.reply(helpMessage)
        .catch(error => {
          console.error('Error sending reply message:', error);
        });
    },
};