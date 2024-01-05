//const axios = require('axios').default;
//const noblox = require("noblox.js")
//const { OpenCloud, DataStoreService } = require('rbxcloud');
import axios from 'axios';
import noblox from 'noblox.js';
import { EmbedBuilder } from 'discord.js';
//import { OpenCloud, DataStoreService } from 'rbxcloud';
import { Universe, DataStore, OrderedDataStore } from "@daw588/roblox.js";

var universeId
var openCloudKey
var universe;

function setGame(game){
  if (game === 'DeathNote'){
     universeId = 1784924271;
     openCloudKey = process.env.DeathNote_API;
  } else if (game === 'Testing') {
    universeId = 3440737325;
    openCloudKey = process.env.api_testing;
  }

  universe = new Universe(universeId, openCloudKey);
  //OpenCloud.Configure({
  //  DataStoreService: openCloudKey, // This is an API key for DataStoreService
  //  UniverseId: universeId , // You can get the UniverseId from the Asset explorer
  //});
}

export async function getGameInfo(game, interaction) {
  setGame(game)

  if (universeId !== null) {
    noblox.getUniverseInfo(universeId).then(info => {
      const placeInfo = info[0];
      var string = `**${placeInfo.name}** \n🕹️ PLAYING: **${placeInfo.playing}**\n🧑‍🤝‍🧑 VISITS: **${placeInfo.visits}**\n🔧 LAST UPDATED: **${placeInfo.updated}**`
      return interaction.reply(string)
    })
  }
}

//module.exports.MessageSend = async function MessageSend(Message, Topic, interaction, game) {
export async function MessageSend(Message, Topic, interaction, game) {
  setGame(game)
  
    const response = await axios.post(
        `https://apis.roblox.com/messaging-service/v1/universes/${universeId}/topics/${Topic}`,
        {
            'message': Message
        },
        {
            headers: {
                'x-api-key': openCloudKey,
                'Content-Type': 'application/json'
            }
        }
    ).catch(err =>{
        console.log(err.response.status)
        if (err.response.status == 401) return interaction.reply(`**Error:** API key not valid for operation, user does not have authorization`)
        if (err.response.status == 403) return interaction.reply(`**Error:** Publish is not allowed on universe.`)
        if (err.response.status == 500) return interaction.reply(`**Error:** Server internal error / Unknown error.`)
        if (err.response.status == 400){
            if (err.response.data == "requestMessage cannot be longer than 1024 characters. (Parameter 'requestMessage')") return interaction.reply(`**Error:** The request message cannot be longer then 1024 characters long.`)
            console.log(err.response.data)
        }
  })
    if (response){
        if (response.status == 200) return interaction.reply(`Message sucessfully sent! with the following message: ${Message}`)
        if (response.status != 200) return interaction.reply(`**Error:** An unknown issue has occurred.`)
    }
}

//module.exports.getIdFromUsername = async function getIdFromUsername(userId) {
export async function getIdFromUsername(userId) {
  var username = await noblox.getIdFromUsername(userId)
  return username
}

//module.exports.DS_Set = async function SetDataStore(DataStore, key, value, interaction, game, DATA) {
export async function DS_Set(DataStoreName, key, value, interaction, game, DATA) {
  setGame(game)

  key = String(key);
  
  // SetAsync the player's gold
  let username = await noblox.getUsernameFromId(key)
  
  //const DS = DataStoreService.GetDataStore(DataStore);
  const DS = new DataStore(universe, DataStoreName);
  DS.SetAsync(key, value).then((result) => {
      console.log('Data saved: ', result);
      var string = `You have successfully added ${value} to ${key} in ${DataStore} [${game}]`;
      if (DataStoreName === 'BanData') {
        if (typeof value === "object" && value !== null) {
          string = `${username} has now been banned from **[${game}]** TEMP: **[${DATA.Hours}]** hours`
        } else {
          string = `${username} has now been banned from **[${game}]**`
        }
      }
      return interaction.reply(string)
  }).catch((err) => {
      console.log('Error', err);
  });
}

//module.exports.DS_Get = async function GetDataStore(DataStore, key, interaction, game) {
export async function DS_Get(DataStoreName, key, interaction, game) {
  setGame(game)

  key = String(key);
  
  let username = await noblox.getUsernameFromId(key)
  
  //const DS = DataStoreService.GetDataStore(DataStore);
  const DS = new DataStore(universe, DataStoreName);
  DS.GetAsync(key).then(([data, keyInfo]) => {
    console.log(keyInfo.DataType === JSON); // true / false
    console.log(keyInfo.CreatedTime); // UNIX Timestamp
    console.log(keyInfo.UpdatedTime); // UNIX Timestamp
    console.log(keyInfo.Version); // DataStore key version
    //Checking if data is an object
    var string = `${key} does exists in ${DataStoreName} with the following values\n`;
    if (typeof data === "object" && data !== null) {
      console.log('data is a table (object), Listing through object')
      for (const key in data) {
          console.log(`${key}: ${data[key]}`);
          string = string + `${key}: ${data[key]}` + '\n'
      }
    } else {
      console.log('data is not a table (object)', data)
    }
    if (DataStoreName === 'BanData') {
      if (typeof data === "object" && data !== null) {
        var hoursLeft = Math.round((data.Temp - Math.round(Date.now() / 1000))/3600)
        string = `${username} is banned from **[${game}]** for **[${hoursLeft}]** hours`
      } else {
        string = `${username} is banned from **[${game}]**`
      }
    }
    return interaction.reply(string)
  }).catch((err) => {
      console.log('Error', err);
      return interaction.reply(`${key} does not exists in ${DataStoreName} **[${game}]**`)
  });;
}

//module.exports.DS_Remove = async function GetDataStore(DataStore, key, interaction, game) {
export async function DS_Remove(DataStoreName, key, interaction, game) {
  setGame(game)

  key = String(key);

  let username = await noblox.getUsernameFromId(key)
  
  //const DS = DataStoreService.GetDataStore(DataStoreName);
  const DS = new DataStore(universe, DataStoreName);
  DS.RemoveAsync(key).then((result) => {
    console.log('Data removed: ', result);
    var string = `${key} has been removed from ${DataStore} **[${game}]**`;
    if (DataStoreName === 'BanData') {
      string = `${username} has been unbanned from **[${game}]**`
    }
    return interaction.reply(string)
  }).catch((err) => {
      console.log('Error', err);
  });
}

//module.exports.DS_List = async function ListDataStore(DataStore, interaction, game) {
export async function DS_List(DataStoreName, interaction, game, title, DATA) {
  setGame(game)

  const orderedDS = new OrderedDataStore(universe, DataStoreName);

  //TO SETASYNC
  if (DATA.User !== null && DATA.Value !== null) {
    var usernameId = await noblox.getIdFromUsername(DATA.User)
    //await orderedDS.SetAsync(usernameId, DATA.Value);
    var string = `SUCCESSFULLY SET DATASTORE VALUE OF **${DATA.User}** TO **${DATA.Value}** IN **${DataStoreName}** [ORDEREDDATASTORE]`
    return interaction.reply(string)
  } else if (DATA.User !== null && DATA.Value === null) {
    var usernameId = await noblox.getIdFromUsername(DATA.User)
    var value = await orderedDS.GetAsync(usernameId)
    var string = `**${DATA.User}'s** VALUE IS **${value}** IN **${DataStoreName}** [ORDEREDDATASTORE]`
    return interaction.reply(string)
  }
  
  var positionInLB = 0;
  var pageNum = 1;
  var pageCache = {};

  const exampleEmbed = new EmbedBuilder()
  .setColor(0x0099FF)
  .setTitle(title)
  .addFields(
    { name: 'LIST', value: '...', inline: true},
  )

  const message = await interaction.reply({ embeds: [ exampleEmbed ], fetchReply: true });

  const pages = await orderedDS.GetSortedAsync(false, 15)
  const entries = pages.GetCurrentPage();
  pageCache[pageNum] = entries;
  
  const showNextPage = async function() {
    if (pageNum >= 1) {
      if (pageCache[pageNum]) {
        const entries = pageCache[pageNum]
      } else {
        if (pages.IsFinished) return;
        await pages.AdvanceToNextPageAsync();
        const entries = pages.GetCurrentPage();
        pageCache[pageNum] = entries;
      }
    }
    const entries = pageCache[pageNum] 
    var str = "";
    positionInLB = (15*pageNum) - 14; //Start position
    for (const [key, value] of Object.entries(entries)) {
      console.log(key, value);
      var user = await noblox.getUsernameFromId(value.key)
      var emoji = "";
      if (positionInLB === 1) {
        emoji = ":first_place:"
      } else if (positionInLB === 2) {
        emoji = ":second_place:"
      } else if (positionInLB === 3) {
        emoji = ":third_place:"
      }
      str += '**['+positionInLB+'] - ' + user + " · " + value.value + "** " + emoji + "\n";
      positionInLB = positionInLB + 1;
    }
    str = str.replace(/\\n/g, "\n");

    var editedEmbed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle(title)
    .addFields(
      { name: 'LIST', value: str, inline: true},
    )

    message.edit({ embeds: [ editedEmbed ] });
    message.reactions.removeAll()

    message.react('⏪')
    message.react('⏩')

    const collectorFilter = (reaction, user) => {
      return ['⏪', '⏩'].includes(reaction.emoji.name) && user.id === interaction.user.id;
    };

    message.awaitReactions({ filter: collectorFilter, max: 1, time: 15000, errors: ['time'] })
    .then(collected => {
      const reaction = collected.first();
      console.log(reaction.emoji.name)

      if (reaction.emoji.name === '⏩') {
        pageNum += 1
        showNextPage();
      } else {
        pageNum -= 1
        if (pageNum <= 0) {pageNum = 1};
        showNextPage();
      }
    })
    .catch(collected => {
      console.log('Time expired for reacting');
    });
  }

  showNextPage();

}

export default {
  getIdFromUsername,
  getGameInfo,
  MessageSend,
  DS_Set,
  DS_Get,
  DS_Remove,
  DS_List,
}