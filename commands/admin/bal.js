const { getUserBalance, addUserIfNotExists } = require('../../database/nedb');
const { getUserFromMention } = require('../../utils/helpers');

module.exports = {
    name: 'adminbal',
    description: 'Check balance of any user as an admin.',
    admin: true, // Indicates this command is restricted to admins
    async execute(message, args) {
        // Check if user mentioned another user
        let user = getUserFromMention(args[0]);
        
        if (!user) {
            user = args[0]; // If not a mention, assume it's a user ID
        }

        // Check if user is valid
        if (!user) {
            return message.reply('Please provide a valid user mention or user ID to check their balance.')
                .catch(error => {
                    console.error('Error sending reply message:', error);
                });
        }

        try {
            // Ensure user is registered in the database
            await addUserIfNotExists(user);

            // Get user's balance
            const balance = await getUserBalance(user);
            
            // Format the reply mentioning the user or using their ID if not in server
            const userMention = message.guild.members.cache.get(user) ? `<@${user}>` : `<@!${user}>`;
            message.reply(`${userMention} has \`${balance.toFixed(2)}\` UWUC`)
                .catch(error => {
                    console.error('Error sending reply message:', error);
                });
        } catch (error) {
            console.error('Error executing adminbal command:', error);
            message.reply('There was an error fetching the user\'s balance.')
                .catch(error => {
                    console.error('Error sending reply message:', error);
                });
        }
    },
};