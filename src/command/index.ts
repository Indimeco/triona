import { ConfigSchema } from '../config';
import { Message } from 'discord.js';
import { getCommand, getArgs } from './parse';

import { getAction } from './actions';
import { writeGuildData } from '../guild';

export const processCommand = (config: ConfigSchema, message: Message) => {
    if (message.author.bot) return null;
    const guildId = message.guild?.id;
    if (!guildId) {
        message.reply('Triona only works for guilds! Try adding her to a server.');
        return null;
    }

    const prefix = config.prefix;
    const messageContent = message.content;
    const command = getCommand(prefix, messageContent);
    const args = getArgs(messageContent);
    if (!command) return null;

    const action = getAction(command);
    if (action) {
        const newGuildData = action.exec(message, args);
        if (newGuildData) writeGuildData(guildId, newGuildData)
    }
}