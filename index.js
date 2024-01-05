//const express = require('express');
//const { Client, GatewayIntentBits, ActivityType } = require("discord.js");
import express from 'express';
import { Client, GatewayIntentBits, ActivityType } from 'discord.js';


//import commands from './deploy-commands.js';
import modules from './module.js';
const app = express();

app.listen(3000, () => {
  console.log("Running!");
})

app.get("/", (req, res) => {
  res.send("The bot is now online");
})

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
  ]
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  if (!interaction.member.roles.cache.some(role => role.name === 'BigBear')) {
    await interaction.reply({ content: 'You do not have permission to use xBEAR Studios Bot', ephemeral: true });
    return;
  }

  const { commandName } = interaction;

  if (commandName === 'server') {
    await interaction.reply(`Server namsss: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
  } else if (commandName === 'dn-stats') {

    const user = interaction.options.getString('username');
    const stat = interaction.options.getString('stat');
    const value = interaction.options.getString('value');

    var body = JSON.stringify({
      "command": `stats`, "username": `${user}`, "stat": `${stat}`, "value": `${value}`
    });

    var size = Buffer.byteLength(body)
    if (size < 1024) {
      modules.MessageSend(body, "MessagingService", interaction, "DeathNote");
    } else {
      interaction.reply(`Message is larger than 1 kB`)
    }
  } else if (commandName === 'dn-data') {

    if (!interaction.member.roles.cache.some(role => role.name === 'BigBear+')) {
      await interaction.reply({ content: 'You do not have permission to use this command', ephemeral: true });
      return;
    }
    
    var user = interaction.options.getString('user');
    var data = interaction.options.getString('data');
    const value = interaction.options.getInteger('value');

    if (!/^\d+$/.test(user)) {
      user = await modules.getIdFromUsername(user)
    } 

    //if (data === "TopDonationsV2" || data === "TopWinsV2" || data === "TopWinsForKiraV2" || data === "TopWinsForLV2") {
      if (/^\d+$/.test(user)) {
        console.log(data,user,value)
        //modules.DS_List(data)
        //modules.DS_Set(data, user, value, interaction, 'DeathNote');
      } 
    //}
  } else if (commandName === 'dn-ban') {
    var user = interaction.options.getString('user');
    const hours = interaction.options.getInteger('hours');

    if (!/^\d+$/.test(user)) {
      user = await modules.getIdFromUsername(user)
    } 

    if (/^\d+$/.test(user)) {
      if (hours !== null) {
        var temp = Math.round(Date.now() / 1000) + (hours*3600)
        modules.DS_Set('BanData', user, {Temp : temp}, interaction, 'DeathNote', {Hours : hours})
      } else {
        modules.DS_Set('BanData', user, 'true', interaction, 'DeathNote')
      }
    }
  } else if (commandName === 'dn-check-ban') {
    var user = interaction.options.getString('user');

    if (!/^\d+$/.test(user)) {
      user = await modules.getIdFromUsername(user)
    }
    if (/^\d+$/.test(user)) {
      modules.DS_Get('BanData', user, interaction, 'DeathNote')
    }
  } else if (commandName === 'dn-unban') {
    var user = interaction.options.getString('user');

    if (!/^\d+$/.test(user)) {
      user = await modules.getIdFromUsername(user)
    }
    if (/^\d+$/.test(user)) {
      modules.DS_Remove('BanData', user, interaction, 'DeathNote')
    }
  } else if (commandName === 'game-stats') {
    var gameName = interaction.options.getString('gamename');

    modules.getGameInfo(gameName, interaction)
  
  } else if (commandName === 'dn-publish') {
    const command = interaction.options.getString('command');
    const value1 = interaction.options.getString('value');

    if (command === 'm' && !interaction.member.roles.cache.some(role => role.name === 'BigBear+')) {
      await interaction.reply({ content: 'You do not have permission to use M commands', ephemeral: true });
      return;
    }

    var body = JSON.stringify({
      "command": `${command}`, "value1": `${value1}`,
    });

    var size = Buffer.byteLength(body)
    if (size < 1024) {
      modules.MessageSend(body, "MessagingService", interaction, "DeathNote");
    } else {
      interaction.reply(`Message is larger than 1 kB`)
    }
  }
  else if (commandName === 'dn-leaderboard') {
    const command = interaction.options.getString('leaderboard');
    const value1 = interaction.options.getString('time');
    const year = interaction.options.getInteger('year');
    const userName = interaction.options.getString('username');
    const valueToSet = interaction.options.getInteger('value');

    //command can either be "All", "Kira", "L"
    //time can either be "All" or Month
    //October_2023 - only for Kira and L wins
    let currentYear =  new Date().getFullYear();
    var data = "null"
    var title = "null"
    if (command === "All") {
      if (value1 === "All") {
        data = "TopWinsV2"
        title = "ALL TIME WINS [DEATH NOTE]"
      } else {
        data = "TopWinsV2"
        title = "ALL TIME WINS [DEATH NOTE]"
      }
    } else if (command === "Kira") {
      if (value1 === "All") {
          data = "TopWinsForKiraV2"
          title = "ALL TIME WINS FOR KIRA [DEATH NOTE]"
      } else {
        if (year === null) {
          data = "TopWinsForKira_" + value1 + "_" + currentYear
          title = "WINS FOR KIRA IN " + value1 + ", " + currentYear + " [DEATH NOTE]"
        } else {
          data = "TopWinsForKira_" + value1 + "_" + year
          title = "WINS FOR KIRA IN " + value1 + ", " + year + " [DEATH NOTE]"
        }
      }
    } else if (command === "L") {
      if (value1 === "All") {
        data = "TopWinsForLV2"
        title = "ALL TIME WINS FOR L" + " [DEATH NOTE]"
      } else {
        if (year === null) {
          data = "TopWinsForL_" + value1 + "_" + currentYear
          title = "WINS FOR L IN " + value1 + ", " + currentYear + " [DEATH NOTE]"
        } else {
          data = "TopWinsForL_" + value1 + "_" + year
          title = "WINS FOR L IN " + value1 + ", " + year + " [DEATH NOTE]"
        }
      }
    }

    if (valueToSet !== null && !interaction.member.roles.cache.some(role => role.name === 'BigBear+')) {
      await interaction.reply({ content: 'You do not have permission to use set leaderboard values', ephemeral: true });
      return;
    }

    if (data !== "null") {
       modules.DS_List(data, interaction, 'DeathNote', title, {
          User: userName, 
          Value: valueToSet
       })
    }
  }
});


client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({
    activities: [{ name: `Overseeing xBEAR Games`, type: ActivityType.Playing }],
    status: 'online',
  });
});

console.log("Running BOT!");
client.login(process.env.token)