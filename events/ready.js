const client = require("../index.js")

module.exports = async (client) => {
    console.log(`${client.user.tag} is up and ready to go!`)

    let usersCount = 0;
    for (const guild of client.guilds.cache) {
    usersCount += (await guild[1].members.fetch()).size
    }
    await console.log(`${client.user.tag} is now conneted to Discord !! Cached ${usersCount} Users`);
};