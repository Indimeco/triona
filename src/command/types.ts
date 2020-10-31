import { Message } from 'discord.js';
import { GuildDataDispatch } from '../guild';
import { GuildData } from '../types';

export type ActionItem = {
    command: string;
    desc: string;
    usage: string;
    example?: string;
    exec: (message: Message, args: string[], guildData: GuildData) => GuildDataDispatch | void;
};

export type Actions = ActionItem[];