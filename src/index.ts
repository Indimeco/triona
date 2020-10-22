import { Client } from 'discord.js';
import { config as dotenvConfig } from 'dotenv';
import { getGuildData } from './guild';

dotenvConfig();

const client = new Client();
client.once('ready', async () => {
    console.log(await getGuildData('sweetpotato'));
});

client.login(process.env.BOT_TOKEN);