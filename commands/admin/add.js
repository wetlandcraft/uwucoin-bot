const { updateUserBalance } = require('../../database/nedb');
const { getUserFromMention } = require('../../utils/helpers');

module.exports = {
    name: 'adminadd',
    description: 'Add coins to a user\'s balance (admin only).',
    admin: true,
    execute(message, args) {
        try {
            const recipient = getUserFromMention(args[0]) || args[0];
            const amount = parseFloat(args[1]);

            if (isNaN(amount) || amount <= 0) {
                return message.reply('Please provide a valid amount to add.')
                .catch(error => {
                  console.error('Error sending reply message:', error);
                });
            }

            updateUserBalance(recipient, amount).then(() => {
                message.reply(`Successfully added ${amount} UwU Coin to <@${recipient}>.`)
                .catch(error => {
                  console.error('Error sending reply message:', error);
                });
            }).catch(err => {
                console.error(err);
                message.reply('There was an error trying to add coins.')
                .catch(error => {
                  console.error('Error sending reply message:', error);
                });
            });
        } catch (error) {
            console.error(error);
            message.reply('There was an error trying to add coins.')
            .catch(error => {
              console.error('Error sending reply message:', error);
            });
        }
    },
};