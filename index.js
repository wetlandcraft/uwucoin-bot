const { Client, Intents, Collection } = require('discord.js');
const fs = require('fs');
const { prefixes, token, adminUserIds } = require('./config.json');

const client = new Client({ 
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES
    ]
});

client.commands = new Collection();

// Function to load commands from a directory
const loadCommands = (dir) => {
    const commandFiles = fs.readdirSync(dir).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./${dir}/${file}`);
        client.commands.set(command.name, command);
    }
};

// Load commands from the main commands directory
loadCommands('commands');

// Load commands from the admin commands directory
loadCommands('commands/admin');

client.once('ready', () => {
    console.log('Bot is ready.');
    client.user.setActivity('THE UwUChain', { type: 'WATCHING' });
    client.user.setStatus('idle');
});

client.on('messageCreate', message => {
    if (message.author.bot) return;

    // Check if the message starts with any of the prefixes
    let prefix = null;
    for (const p of prefixes) {
        if (message.content.startsWith(p)) {
            prefix = p;
            break;
        }
    }
    
    // If no valid prefix is found, return
    if (!prefix) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) {
        return message.reply('Command not found. Try using `uwu!help`.');
    }

    try {
        // Check if user is allowed to use admin commands
        if (command.admin && !adminUserIds.includes(message.author.id)) {
            return message.reply('You do not have permission to use this command.');
        }

        command.execute(message, args, client);
    } catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command!');
    }
});

client.login(token);