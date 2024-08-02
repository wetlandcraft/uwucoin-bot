const { updateUserBalance, getUserBalance, addUserIfNotExists } = require('../../database/nedb');
const { getUserFromMention } = require('../../utils/helpers');

module.exports = {
    name: 'adminremove',
    description: 'Remove coins from a user\'s balance (admin only).',
    admin: true,
    async execute(message, args) {
        try {
            const recipient = getUserFromMention(args[0]) || args[0];
            const amount = parseFloat(args[1]);

            if (isNaN(amount) || amount <= 0) {
                return message.reply('Please provide a valid amount to remove.');
            }

            // Ensure recipient is a valid user ID
            if (recipient.startsWith('<@') && recipient.endsWith('>')) {
                recipient = recipient.slice(2, -1);
                if (recipient.startsWith('!')) {
                    recipient = recipient.slice(1);
                }
            }

            // Add recipient if not already in the database
            await addUserIfNotExists(recipient);

            // Get user's current balance
            const currentBalance = await getUserBalance(recipient);

            if (currentBalance < amount) {
                return message.reply('User does not have enough balance to remove this amount.');
            }

            // Update user's balance (deduct amount)
            await updateUserBalance(recipient, -amount);

            message.channel.send(`Successfully removed ${amount} UwU Coin from <@${recipient}>.`);
        } catch (error) {
            console.error('Error removing coins:', error);
            message.reply('There was an error trying to remove coins.');
        }
    },
};