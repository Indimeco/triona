import { Client, Message } from 'discord.js';
import { config as dotenvConfig } from 'dotenv';

import { processCommand } from './command';
import { config } from './config';
import { checkAlarms } from './time/alarm';

dotenvConfig();

const client = new Client();
client.once('ready', async () => {
  console.log('Triona has been reborn!');
});

client.on('message', (message: Message) => {
  processCommand(config, message);
});

client.setInterval(() => {
  checkAlarms(client);
}, 60000);

client.login(process.env.BOT_TOKEN);
