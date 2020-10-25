import { ActionItem } from "."
import { Message } from 'discord.js';

export const ping: ActionItem = {
    command: 'ping',
    desc: `Test Triona's connectivity`,
    usage: 'ping',
    exec: (m: Message) => { m.channel.send('Pong!') }
}