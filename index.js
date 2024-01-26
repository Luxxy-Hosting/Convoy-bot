const Discord = require('discord.js');
require('dotenv').config();
const fs = require('fs');

const client = new Discord.Client({
    presence: {
        status: 'idle',
        afk: true,
        activity: {
            name: 'with discord.js',
            type: 'PLAYING'
        }
    },
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildBans,
        Discord.GatewayIntentBits.GuildMessageReactions,
        Discord.GatewayIntentBits.GuildPresences,
        Discord.GatewayIntentBits.GuildVoiceStates,
        Discord.GatewayIntentBits.DirectMessages,
        Discord.GatewayIntentBits.DirectMessageReactions,
        Discord.GatewayIntentBits.DirectMessageTyping,
        Discord.GatewayIntentBits.GuildInvites,
    ],
    partials: [ Discord.Partials.Message, Discord.Partials.Channel, Discord.Partials.Reaction, Discord.Partials.User ],
});
module.exports = client;

console.log('Loading commands...');

global.error = "<:No:979776354486726726>"
global.success = "<:yes:964979709945470977>"

client.categories = fs.readdirSync('./commands');
client.aliases = new Discord.Collection();
client.commands = new Discord.Collection();
client.events = new Discord.Collection();

require('./handlers/command_handler.js')(client);
require('./handlers/event_handler.js')(client);
require('./handlers/mongoose.js')(client);

client.login(process.env.BOT_TOKEN);