import { ConfigSchema } from '../config';
import { Message } from 'discord.js';
import { isNil, match, toLower, unless } from 'ramda';

const commandRegex = (prefix: string) => new RegExp(`^${prefix}([\\w\\d]+)`, 'i');

const getCommand = (prefix: string, message: string): string | null => {
    const matchResult = match(
        commandRegex(prefix),
        message,
    );
    const formatMatch = unless(isNil, toLower);
    return formatMatch(matchResult[1]);
}

export const processCommand = (config: ConfigSchema, message: Message) => {
    if (message.author.bot) return null;

    const prefix = config.prefix;
    const messageContent = message.content;
    const command = getCommand(prefix, messageContent);

    switch (command) {
        case (null):
            break;
        case ('ping'):
            message.channel.send('Pong.');
    }
}