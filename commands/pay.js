const { getUserBalance, updateUserBalance, addUserIfNotExists } = require('../database/nedb');
const { getUserFromMention } = require('../utils/helpers');

module.exports = {
    name: 'pay',
    description: 'Transfer coins to another user.',
    async execute(message, args) {
        try {
            const sender = message.author;
            const amount = parseFloat(args[1]);

            if (isNaN(amount) || amount <= 0) {
                return message.reply('Please provide a valid amount to pay.')
                .catch(error => {
                  console.error('Error sending reply message:', error);
                });
            }

            // Validate the amount to ensure it has at most two decimal places
            if (!/^\d+(\.\d{1,2})?$/.test(args[1])) {
                return message.reply('Please provide a valid amount with up to two decimal places.')
                .catch(error => {
                  console.error('Error sending reply message:', error);
                });
            }

            let recipient = getUserFromMention(args[0]) || args[0];
            if (!recipient) {
                return message.reply('Invalid Arguments.')
                .catch(error => {
                  console.error('Error sending reply message:', error);
                });
            }

            // Ensure recipient is a valid user ID
            if (recipient.startsWith('<@') && recipient.endsWith('>')) {
                recipient = recipient.slice(2, -1);
                if (recipient.startsWith('!')) {
                    recipient = recipient.slice(1);
                }
            }

            // Add sender and recipient if they do not exist in the database
            await addUserIfNotExists(sender.id);
            await addUserIfNotExists(recipient);

            // Get sender's balance and check if sufficient funds
            const senderBalance = await getUserBalance(sender.id);
            if (senderBalance < amount) {
                return message.reply('You don\'t have enough balance to make this payment.')
                .catch(error => {
                  console.error('Error sending reply message:', error);
                });
            }

            // Calculate new balances
            const newSenderBalance = parseFloat((senderBalance - amount).toFixed(2));
            const recipientBalance = await getUserBalance(recipient);
            const newRecipientBalance = parseFloat((recipientBalance + amount).toFixed(2));

            // Update balances
            await updateUserBalance(sender.id, newSenderBalance);
            await updateUserBalance(recipient, newRecipientBalance);

            // Send success messages to sender and recipient
            message.reply(`Successfully transferred ${amount} UWUC to <@${recipient}>.`)
            .catch(error => {
              console.error('Error sending reply message:', error);
            });
            sender.send(`\`${amount}\` UWUC has been sent to <@${recipient}>.\nAccount \`${sender.id}\` has been debited by \`${amount.toFixed(2)}\` UWUC.\nCurrent Balance: \`${newSenderBalance.toFixed(2)}\``);
            
            const recipientUser = await message.client.users.fetch(recipient); // Fetch the user object for recipient
            recipientUser.send(`\`${amount}\` UWUC has been received from <@${sender.id}>.\nAccount \`${recipient}\` has been credited by \`${amount.toFixed(2)}\` UWUC.\nCurrent Balance: \`${newRecipientBalance.toFixed(2)}\``);
        } catch (error) {
            console.error('Error transferring coins:', error);
            message.reply('There was an error trying to transfer coins.')
            .catch(error => {
              console.error('Error sending reply message:', error);
            });
        }
    },
};