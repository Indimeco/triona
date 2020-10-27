import { ConfigSchema } from '../config';
import { Message } from 'discord.js';
import { getCommand, getArgs } from './parse';

import { getAction } from './actions';
import { getGuildData, modifyGuildData, writeGuildData } from '../guild';

export const processCommand = async (config: ConfigSchema, message: Message) => {
    if (message.author.bot) return null;
    const guildId = message.guild?.id;
    if (!guildId) {
        message.reply('Triona only works for guilds for now! Try adding her to a server.');
        return null;
    }
    const guildData = await getGuildData(guildId);

    const prefix = config.prefix;
    const messageContent = message.content;
    const command = getCommand(prefix, messageContent);
    const args = getArgs(messageContent);
    if (!command) return null;

    const action = getAction(command);
    if (action) {
        const dispatch = action.exec(message, args);
        if (dispatch) {
            const newGuildData = modifyGuildData(guildData, dispatch);
            writeGuildData(guildId, newGuildData);
            message.channel.send("Got it!");
        }
    }
}