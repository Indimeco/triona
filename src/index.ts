import { Client, Message } from 'discord.js';
import { config as dotenvConfig } from 'dotenv';
import { processCommand } from './command';
import { config } from './config';

dotenvConfig();

const client = new Client();
client.once('ready', async () => {
    console.log('Triona has been reborn!')
});

client.on('message', (message: Message) => {
    processCommand(config, message);
})

client.login(process.env.BOT_TOKEN);
