import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

const clientId = "997881637054455808";
const guildId = "603167912924151839";

export const commands = [
	new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
  
  new SlashCommandBuilder()
  .setName('dn-stats')
  .setDescription('Changes player stat in Death Note')
  .addStringOption(option =>
    option.setName('username')
      .setDescription('Username of the Player')
      .setRequired(true) 
  )
  .addStringOption(option =>
    option.setName('stat')
      .setDescription('Stat name of the data')
      .setRequired(true) 
  )
  .addStringOption(option =>
    option.setName('value')
      .setDescription('Value of the stat')
      .setRequired(true) 
  ),
  
  new SlashCommandBuilder()
  .setName('dn-publish')
  .setDescription('Publishes a message to Death Note')
  .addStringOption(option =>
    option.setName('command')
      .setDescription('Command')
      .setRequired(true) 
  )
  .addStringOption(option =>
    option.setName('value')
      .setDescription('Value')
      .setRequired(true) 
  ),
  new SlashCommandBuilder()
  .setName('dn-ban')
  .setDescription('bans a user from Death Note')
  .addStringOption(option =>
    option.setName('user')
      .setDescription('ID or Username of a player')
      .setRequired(true) 
  )
  .addIntegerOption(option =>
    option.setName('hours')
      .setDescription('hours of the ban')
      .setRequired(false) 
  ),
  new SlashCommandBuilder()
  .setName('dn-leaderboard')
  .setDescription('Shows specified leaderboard of Death Note')
  .addStringOption(option =>
    option.setName('leaderboard')
      .setDescription('All, Kira, or L')
      .setRequired(true) 
  )
  .addStringOption(option =>
    option.setName('time')
      .setDescription('All or name of the month October')
      .setRequired(true) 
  )
  .addIntegerOption(option =>
    option.setName('year')
      .setDescription('Year of the month')
      .setRequired(false) 
  )
  .addStringOption(option =>
    option.setName('username')
      .setDescription("username of the player")
      .setRequired(false) 
  )
  .addIntegerOption(option =>
    option.setName('value')
      .setDescription("[ADMIN] set the value of user to the leaderboard")
      .setRequired(false) 
  ),
  new SlashCommandBuilder()
  .setName('dn-data')
  .setDescription('changes leaderboard and other data in Death Note')
  .addStringOption(option =>
    option.setName('user')
      .setDescription('ID or Username of a player')
      .setRequired(true) 
  )
  .addStringOption(option =>
    option.setName('data')
      .setDescription('name of a DataStore')
      .setRequired(true) 
  )
  .addIntegerOption(option =>
    option.setName('value')
      .setDescription('value to set to the Datastore')
      .setRequired(true) 
  ),
  
  new SlashCommandBuilder()
  .setName('dn-check-ban')
  .setDescription('checks if user is banned from Death Note')
  .addStringOption(option =>
    option.setName('user')
      .setDescription('ID or Username of a player')
      .setRequired(true)       
  ),
  new SlashCommandBuilder()
  .setName('dn-unban')
  .setDescription('unbans user from Death Note')
  .addStringOption(option =>
    option.setName('user')
      .setDescription('ID or Username of a player')
      .setRequired(true)       
  ),
  new SlashCommandBuilder()
  .setName('game-stats')
  .setDescription('retrieves statistics for specific xBEAR Games')
  .addStringOption(option =>
    option.setName('gamename')
      .setDescription('Game Name')
      .setRequired(true)       
  ),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

export default { commands }