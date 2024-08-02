const { updateUserBalance, addUserIfNotExists } = require('../../database/nedb');
const { getUserFromMention } = require('../../utils/helpers');

module.exports = {
    name: 'adminset',
    description: 'Set a user\'s balance to a specific amount (admin only).',
    admin: true,
    async execute(message, args) {
        try {
            let recipient = getUserFromMention(args[0]) || args[0];
            const amount = parseFloat(args[1]);

            if (isNaN(amount) || amount < 0) {
                return message.reply('Please provide a valid amount to set.');
            }

            console.log(`Setting balance for ${recipient} to \`${amount}\` UWUC`);

            // Add user if not exists
            await addUserIfNotExists(recipient);

            // Update user balance
            await updateUserBalance(recipient, amount);

            message.reply(`Successfully set <@${recipient}>'s balance to ${amount} UWUC.`);

        } catch (error) {
            console.error('Error setting balance:', error);
            message.reply('There was an error trying to set balance.');
        }
    },
};