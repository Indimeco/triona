import { Client } from 'discord.js';
import { config as dotenvConfig } from 'dotenv';
import { getServerTime } from './time';

dotenvConfig();

const client = new Client();
client.once('ready', () => {
    const serverTime = getServerTime();
    console.log(`Server time is ${serverTime}`);
});

client.login(process.env.BOT_TOKEN);