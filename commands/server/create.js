const Discord = require('discord.js');
const axios = require('axios');
const userData = require('../../models/Users');
const emoji = '<:blue_arrow:964977636084416535>'
module.exports = async (client, message, args) => {
    const userDB = await userData.findOne({ ID: message.author.id })
    if (!userDB) {
        message.reply(`${error} You dont have an account created. type \`${process.env.BOT_PREFIX}user new\` to create one`);
        return;
    }

    function getPassword() {
        let length = 10,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
            // make it start with a spacial character and Capital letter end with a number
            retVal += "!ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".charAt(Math.floor(Math.random() * "!ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".length));
        for (let i = 0, n = charset.length; i < length - 2; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        retVal += "0123456789".charAt(Math.floor(Math.random() * "0123456789".length));
        //return retVal;

        return '#Password123'
    }

    if(!args[1] || args[1]?.toLowerCase() === 'list'){  
        
        const panelButton = new Discord.ButtonBuilder()
        .setStyle('Link')
        .setURL('https://panel.luxxy.host')
        .setLabel("Panel")
        
        const row = new Discord.ActionRowBuilder()
        .addComponents([panelButton])
        
        const noTypeListed = new Discord.EmbedBuilder() 
        .setColor(0x36393f)
        .setTitle('Types of servers you can create:')
        .setDescription(`for more info about each server type, type \`${process.env.BOT_PREFIX}server create <type>\``)
        .setFooter({ text: `Example: ${process.env.BOT_PREFIX}server create discord nodejs` })

        message.channel.send({
            content: `> ${error} What type of server you want me to create?`,
            embeds: [noTypeListed],
            components: [row]
        })
        return 
    }
    let ServerData
    let srvname = args.slice(2).join(' ')
    axios({
        url: process.env.CONVOY_URL + "/api/application/nodes/3/addresses?filter[server_id]=",
        method: 'GET',
        followRedirect: true,
        maxRedirects: 5,
        headers: {
            'Authorization': 'Bearer ' + process.env.CONVOY_TOKEN,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    }).then(response => {
        console.log(response.data)
        try{
            password = getPassword()
            ServerData = require(`../../vps-plans/${args[1]?.toLowerCase()}.js`)(userDB.consoleID, srvname ? srvname : args[1], password, response.data.data[0].id)
            console.log(password)
            console.log(userDB.consoleID)
        }catch(err){
            console.log(err)
            message.reply(`${error} I could no find any server type with the name: \`${args[1]}\`\nType \`!server create list\` for more info`)
            return
        }
    }).catch(error => {
        console.log(error)
    })   

    let msg = await message.reply(`${success} Attemping to create you a server, please wait. . .`)

    axios({
        url: process.env.CONVOY_URL + "/api/application/servers",
        method: 'POST',
        followRedirect: true,
        maxRedirects: 5,
        headers: {
            'Authorization': 'Bearer ' + process.env.CONVOY_TOKEN,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        data: ServerData,
    }).then(response => {
        console.log(`[${new Date().toLocaleString()}] [${message.guild.name}] [${message.author.tag}] Created server: ${response.data.data.name}`)

        const serverButton = new Discord.ButtonBuilder()
        .setStyle('Link')
        .setURL(`${process.env.CONVOY_URL}/server/${response.data.data.uuid}`)
        if (response.data.data.name.length < 25) {
            serverButton.setLabel(`[${response.data.data.name}] Server Link`)
        } else {
            serverButton.setLabel(`Server Link`)
        }

        const row2 = new Discord.ActionRowBuilder()
        .addComponents([serverButton])
        
        msg.edit({
            content: null,
            embeds:[
                new Discord.EmbedBuilder()
                .setColor(Discord.Colors.Green)
                .setTitle(`${success} Server Created Successfully`)
                .setDescription(`
                > **Status:** \`${response.statusText}\`
                > **User ID:** \`${userDB.consoleID}\`
                > **VPS ID:** \`${response.data.data.uuid}\`
                > **VPS Name:** \`${srvname ? srvname : args[1]}\`
                > **VPS Plan:** \`${args[1].toLowerCase()}\`
                `)
            ],
            components: [row2]
        }).then( async () => {
            message.author.send({
                embeds:[ new Discord.EmbedBuilder()
                .setColor(Discord.Colors.Green)
                .setDescription(`${success} Here is your vps password and ip
                 > **IP:** \`${response.data.data.limits.addresses.ipv4[0].address}\`
                 \n> **Password:** \`${password}\`
                `)
                .setFooter({ text: `You can change your password in the panel` })
                ]
            }).catch(error => {
                message.reply(`${error} I couldn't send you a DM, please make sure you have DMs enabled.`)
            })
        })
            
    }).catch(error => {
        console.log(error)
        if (error == "Error: Request failed with status code 400") {
            msg.edit({
                content: null,
                embeds:[
                    new Discord.EmbedBuilder()
                    .setColor(Discord.Colors.Red)
                    .addField({ name: `${error} Server creation failed`, value: `The node had ran out of allocations/ports!`})
                ]
            })
        }else if (error == "Error: Request failed with status code 504") {
            msg.edit({
                content: null,
                embeds:[
                    new Discord.EmbedBuilder()
                    .setColor(Discord.Colors.Red)
                    .addFields({ name: `${error} Server creation failed`, value: `The node is currently offline or having issues`})
                ]
            })
        }else if (error == "Error: Request failed with status code 429") {
            msg.edit({
                content: null,
                embeds:[
                    new Discord.EmbedBuilder()
                    .setColor(Discord.Colors.Red)
                    .addFields({ name: `${error} Server creation failed`, value: `Uh oh, This shouldn\'t happen, Try again in a minute or two.`})
                    ]
            })
        }else if (error == "Error: Request failed with status code 429") {
            msg.edit({
                content: null,
                embeds:[
                    new Discord.EmbedBuilder()
                    .setColor(Discord.Colors.Red)
                    .addFields({ name: `${error} Server creation failed`, value: `Uh oh, This shouldn\'t happen, Try again in a minute or two.`})
                    ]
            })
        }else {
            msg.edit({
                content: null,
                embeds:[
                    new Discord.EmbedBuilder()
                    .setColor(Discord.Colors.Red)
                    .addFields({ name: `${error} Server creation failed`, value: `${error}.`})
                ]
            })
        }
    })
    
}