const userData = require('../../models/Users');
const Discord = require('discord.js');
const axios = require('axios')
module.exports = async (client, message, args) => {
    async function sleep(ms) {
        return new Promise((resolve, reject) => {
         setTimeout(() => {
        resolve();
    }, ms)
        })
    }
    const userDB = await userData.findOne({ ID: message.author.id })
    if(!userDB) return message.reply(`${error}` + " You dont have an account created. type `!user new` to create one")
    await axios({
        url: process.env.CONVOY_URL + "/api/application/servers/?filter[user_id]=" + userDB.consoleID,
        method: 'GET',
        followRedirect: true,
        maxRedirects: 5,
        headers: {
            'Authorization': 'Bearer ' + process.env.CONVOY_TOKEN,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    }).then(async response => {
        let servers = response.data.data.map(x => x.uuid)

        let msg = await message.reply({content: `You are going to delete your account with username: \`${userDB.username}\`. Once you click the yes button all your ${servers.length > 1 ? '\`'+ servers.length + '\` servers' : 'servers'} will be deleted.\n\n⚠️ *This acction is not reversable. once you deleted your account all your data will be lost forever*`, components:[
            new Discord.ActionRowBuilder()
            .addComponents(
				new Discord.ButtonBuilder()
					.setCustomId('DeleteTheAccount')
					.setLabel('Yes')
					.setStyle('Success'),
			)
            .addComponents(
				new Discord.ButtonBuilder()
					.setCustomId('CancelAccountDeletion')
					.setLabel('No')
					.setStyle('Danger'),
			)
        ]}
        )

        const filter = i => i.user.id === message.author.id;
        const collector = msg.createMessageComponentCollector({ filter, time: 30000 });
    
        collector.on('collect', async i => {
            i.deferUpdate()
            if(i.customId === "DeleteTheAccount") return collector.stop('DeleteTheAccount')
            if(i.customId === "CancelAccountDeletion") return collector.stop('CancelAccountDeletion')
        })

        collector.on('end', async(a, reason) => {

            msg.edit({
                components:[
                    new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId('DeleteTheAccount')
                            .setLabel('Yes')
                            .setStyle('Success')
                            .setDisabled(true)
                    )
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId('CancelAccountDeletion')
                            .setLabel('No')
                            .setStyle('Danger')
                            .setDisabled(true)
                    )
                ]
            })


            if(reason === 'time'){
                msg.edit({
                    components:[
                        new Discord.ActionRowBuilder()
                        .addComponents(
                            new Discord.ButtonBuilder()
                                .setCustomId('DeleteTheAccount')
                                .setLabel('Yes')
                                .setStyle('Success')
                                .setDisabled(true)
                        )
                        .addComponents(
                            new Discord.ButtonBuilder()
                                .setCustomId('CancelAccountDeletion')
                                .setLabel('No')
                                .setStyle('Danger')
                                .setDisabled(true)
                        )
                    ]
                })
                return
            }
            if(reason === 'CancelAccountDeletion'){
                msg.edit({embeds:[
                    new Discord.EmbedBuilder()
                    .setTitle(':x: Account Deletion canceled')
                    .setColor(Discord.Colors.Red)
                ]})
                return
            }
            if(reason === 'DeleteTheAccount'){
                if(servers.length > 0){
                    await msg.edit('Deleting servers...')
                    await Promise.all(servers.map(async server => {
                        await axios({
                            url: process.env.CONVOY_URL + "/api/application/servers/" + server,
                            method: 'DELETE',
                            followRedirect: true,
                            maxRedirects: 5,
                            headers: {
                                'Authorization': 'Bearer ' + process.env.CONVOY_TOKEN,
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                            }
                        }).then(() => {}).catch(err => {return msg.edit('Error deleting server')})
                    }))
                }

                await msg.edit('Deleting account... Note: this may take a while as we are deleting all your data')
                await sleep(60000)
                await axios({
                    url: process.env.CONVOY_URL + "/api/application/users/" + userDB.consoleID,
                    method: 'DELETE',
                    followRedirect: true,
                    maxRedirects: 5,
                    headers: {
                        'Authorization': 'Bearer ' + process.env.CONVOY_TOKEN,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    }
                }).then(() => {
                    const userData1 = require('../../models/Users'); userData1.deleteOne({ ID: userDB.ID }).catch(err => {return console.log(err)})
                    msg.edit('Account Deleted')
                    
                }).catch(err => {
                    msg.edit('There was an error deleting your account')
                    console.log(err)
                })
            }
        })


    }).catch(err=> {
        message.channel.send(`${err}.`)
    })
}