const Discord = require('discord.js');

module.exports = {
    name: 'ping',
    category: 'info',
    description: 'Returns latency and API ping',
    run: async (client, message, args) => {
        const msg = await message.channel.send(`🏓 Pinging....`);

        const embed = new Discord.EmbedBuilder()
            .setTitle('Pong!')
            .setDescription(`Latency is ${Math.floor(msg.createdTimestamp - message.createdTimestamp)}ms\nAPI Latency is ${Math.round(client.ws.ping)}ms`)
            .setColor(Discord.Colors.Blue)
            .setFooter({ text: `Requested by ${message.author.tag}`, icon_url: message.author.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        msg.edit({ embeds: [embed] });
    }
}