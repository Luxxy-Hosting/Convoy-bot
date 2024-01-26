const Discord = require('discord.js');
const axios = require('axios');
const userData = require('../../models/Users');
module.exports = async (client, message, args) => {
    const userDB = await userData.findOne({ ID: message.author.id });
    if(!userDB) return message.reply(`:x: You dont have an account created. type \`${process.env.BOT_PREFIX}user new\` to create one`)

    const CAPSNUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    var getPassword = () => {

        var password = "";
        while (password.length < 10) {
            password += CAPSNUM[Math.floor(Math.random() * CAPSNUM.length)];
        }
        return password;
    };

    let password = await getPassword();
    axios({
        url: process.env.CONVOY_URL + "/api/application/users/" + userDB.consoleID,
        method: 'GET',
        followRedirect: true,
        maxRedirects: 5,
        headers: {
            'Authorization': 'Bearer ' + process.env.CONVOY_TOKEN,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    }).then(fetch => {
        const data = {
            "root_admin": fetch.data.data.root_admin,
            "name": fetch.data.data.username,
            "email": fetch.data.data.email,
            "password": password
        }
        axios({
            url: process.env.CONVOY_URL + "/api/application/users/" + userDB.consoleID,
            method: 'PUT',
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                'Authorization': 'Bearer ' + process.env.CONVOY_TOKEN,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            data: data,
        }).then(user => {
            client.users.cache.get(message.author.id).send({embeds:[
                new Discord.EmbedBuilder()
                .setColor(Discord.Colors.Blue)
                .addFields({ name: 'Reset Password', value: `New password for the Panel: ||**${data.password}**||` })
                .setFooter({text:`This message will autodestruct in 10 minutes`})
            ]}).then(x => {
                message.channel.send({embeds:[
                    new Discord.EmbedBuilder()
                    .setTitle(`✅ | Password Changed Succesufuly`)
                    .setColor(Discord.Colors.Green)
                    .addFields({ name: 'Done', value: 'Check your [dms](https://discord.com/channels/@me/${x.channelId}) for your new password!'})
                ]}).catch(err => {
                    message.channel.send(`${err}`)
                })
                setInterval(() => {
                    x.delete().catch(err => {})
                },600000)
            }).catch(err => {
                message.channel.send(`${err}`)
            })
        }).catch(err => {
            message.channel.send(`${err}`)
        })
    }).catch(err => {
        message.channel.send(`${err}`)
    })
}