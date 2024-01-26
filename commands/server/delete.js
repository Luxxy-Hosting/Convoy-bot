const Discord = require('discord.js');
const axios = require('axios');
const userData = require('../../models/Users');
module.exports = async (client, message, args) => {
    const userDB = await userData.findOne({ ID: message.author.id })
    if (!userDB) {
        message.reply(`${error} You dont have an account created. type \`${process.env.BOT_PREFIX}user new\` to create one`);
        return;
    }
    if(!args[1]) return message.reply(`${error} What server should i delete? please provide you server id *(${process.env.BOT_PREFIX}server delete <server id>)*`)
    if (args[1].match(/[0-9a-z]+/i) == null)
        return message.channel.send("lol only use english characters.");

    args[1] = args[1].split('-')[0];

    let msg = await message.channel.send('Let me check if this is your server, please wait . . .')
    axios({
        url: process.env.CONVOY_URL + "/api/application/servers?filter[user_id]=" + userDB.consoleID,
        method: 'GET',
        followRedirect: true,
        maxRedirects: 5,
        headers: {
            'Authorization': 'Bearer ' + process.env.CONVOY_TOKEN,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    }).then(async response => {
        const preoutput = response.data.data
        const output = await preoutput.find(srv => srv.id ? srv.id == args[1] : false)

        if(!output) return msg.edit(`:x: I could not find that server`)
        if (!output.user_id === userDB.consoleID) return msg.edit(`:x: You are not the owner of this server`)

        msg.edit({
            content: `Are you sure you want to delete \`${output.name}\`? once you delete your server you will never be able to recover it and all data and files will be lost forever!`,
            components:[
                new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('AcceptDelete')
                        .setLabel('Yes')
                        .setStyle('Success'),
                )
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('RejectDelete')
                        .setLabel('No')
                        .setStyle('Danger'),
                )
            ]
        })

        const filter = i => i.user.id === message.author.id;
        const Collector = msg.createMessageComponentCollector({ filter, time: 300000 });

        Collector.on('collect', async i => {
            i.deferUpdate()
            Collector.stop()
            if(i.customId === "AcceptDelete") {
                msg.edit({
                    content: `Deleting Server \n Please wait . . .`,
                })

                axios({
                    url: process.env.CONVOY_URL + "/api/application/servers/" + output.uuid,
                    method: 'get',
                    followRedirect: true,
                    maxRedirects: 5,
                    headers: {
                        'Authorization': 'Bearer ' + process.env.CONVOY_TOKEN,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    }
                }).then(deleted => {
                    axios({
                        url: process.env.CONVOY_URL + "/api/application/servers/" + output.uuid,
                        method: 'DELETE',
                        followRedirect: true,
                        maxRedirects: 5,
                        headers: {
                            'Authorization': 'Bearer ' + process.env.CONVOY_TOKEN,
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        }
                    }).then(() => {
                        msg.edit(`${success} Server deleted successfully`)
                    }).catch(err => {
                        msg.edit(`Error: ${err}`)
                    })
                })


            }
            if(i.customId === "RejectDelete") {
                msg.edit({
                    content: `${success} Server deletion canceled`,
                })
            }
        })

        Collector.on('end',() => {
            msg.edit({components:[]})
        })
    })  
}