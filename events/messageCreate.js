const wait = require('node:timers/promises').setTimeout;
const chalk = require('chalk');
const { Discord, EmbedBuilder } = require('discord.js');

module.exports = async (client, message) => {
  const args = message.content.slice(process.env.BOT_PREFIX.length).split(/ +/);
  const cmd = args.shift().toLowerCase();
  const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));
  try{
      if(cmd === 'user'){
          try{
              if(!args[0]) return require('../commands/user/help.js')(client, message, args)
              await console.log(chalk.red(`[#${message.channel.name}]`) + chalk.yellow(` ${message.author.tag} (${message.author.id})`) + chalk.green(` ${message.content}`))
              require(`../commands/user/${args[0]}.js`)(client, message, args)
          }catch(err){console.log(err).toString()}
          return
      }else if(cmd === 'server'){
          try{
              if(!args[0]) return require('../commands/server/help.js')(client, message, args)
              await console.log(chalk.red(`[#${message.channel.name}]`) + chalk.yellow(` ${message.author.tag} (${message.author.id})`) + chalk.green(` ${message.content}`))
              require(`../commands/server/${args[0]}.js`)(client, message, args)
          }catch(err){console.log(err).toString()}
          return
      }else if(cmd === 'staff'){
          if(!message.member.roles.cache.has(config.roleID.support || config.roleID.admin || '980035372505505862')) return
          try{
              if(!args[0]) return require('../commands/staff/help.js')(client, message, args)
              await console.log(chalk.red(`[#${message.channel.name}]`) + chalk.yellow(` ${message.author.tag} (${message.author.id})`) + chalk.green(` ${message.content}`))
              require(`../commands/staff/${args[0]}.js`)(client, message, args)
          }catch(err){console.log(err).toString()}
          return
      }else if(cmd === 'settings'){
          try{
              if(!args[0]) return require('../commands/settings/help.js')(client, message, args)
              await console.log(chalk.red(`[#${message.channel.name}]`) + chalk.yellow(` ${message.author.tag} (${message.author.id})`) + chalk.green(` ${message.content}`))
              require(`../commands/settings/${args[0]}.js`)(client, message, args)
          }catch(err){console.log(err).toString()}
          return
      }


      if(!command) return
      await console.log(chalk.red(`[#${message.channel.name}]`) + chalk.yellow(` ${message.author.tag} (${message.author.id})`) + chalk.green(` ${message.content}`))
      command.run(client, message, args);
  }catch(err){}
}