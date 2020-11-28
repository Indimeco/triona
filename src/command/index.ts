import { Message } from 'discord.js';

import { ConfigSchema } from '../config';
import { getGuildData, modifyGuildData, writeGuildData } from '../guild';
import { sendMessage } from '../sendMessage';

import { getCommand, getArgs } from './parse';
import { getAction } from './getAction';

export const processCommand = async (config: ConfigSchema, message: Message) => {
  if (message.author.bot) return null;
  const guildId = message.guild?.id;
  if (!guildId) {
    message.reply('Triona only works for guilds for now! Try adding her to a server.');
    return null;
  }

  const { prefix } = config;
  const messageContent = message.content;
  const command = getCommand(prefix, messageContent);
  const args = getArgs(messageContent);
  if (!command) return null;

  const action = getAction(command);
  if (action) {
    /**
     * There is no method for caching data atm
     * which means we read from fs on every command
     */
    const guildData = await getGuildData(guildId);

    const dispatch = await action.exec(message, args, guildData);
    if (dispatch) {
      const newGuildData = modifyGuildData(guildData, dispatch);
      writeGuildData(guildId, newGuildData);
      sendMessage(message, 'Got it~');
    }
  } else {
    sendMessage(message, "I'm not sure about that. Try `help` for available commands~");
  }
  return true;
};
