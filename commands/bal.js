const { getUserBalance, addUserIfNotExists } = require('../database/nedb');

module.exports = {
    name: 'bal',
    description: 'Check your balance.',
    execute(message, args) {
        try {
            const user = message.author.id;
            addUserIfNotExists(user).then(() => {
                getUserBalance(user).then(balance => {
                    message.reply(`You have ${balance.toFixed(2)} UWUC.`);
                }).catch(err => {
                    console.error(err);
                    message.reply('There was an error trying to check your balance.')
                    .catch(error => {
                      console.error('Error sending reply message:', error);
                    });
                });
            }).catch(err => {
                console.error(err);
                message.reply('There was an error trying to check your balance.')
                .catch(error => {
                  console.error('Error sending reply message:', error);
                });
            });
        } catch (error) {
            console.error(error);
            message.reply('There was an error trying to check your balance.')
            .catch(error => {
              console.error('Error sending reply message:', error);
            });
        }
    },
};