import { Message } from 'discord.js';
import { find, propEq } from 'ramda';

import { ping } from './ping';
import { help } from './help';
import { setAlarm } from './setAlarm';
import { GuildDataAction } from '../../guild';

export type ActionItem = {
    command: string;
    desc: string;
    usage: string;
    exec: (message: Message, args: string[]) => GuildDataAction | void;
};

export type Actions = ActionItem[];

export const getAction = (command: string) => find<ActionItem>(
    propEq('command', command)
)(getActions());

export const getActions: () => Actions = () => [
    ping,
    help,
    setAlarm
]