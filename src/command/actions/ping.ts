import { ActionItem } from '../types';

export const ping: ActionItem = {
  command: 'ping',
  desc: `Test Triona's connectivity`,
  usage: 'ping',
  exec: m => {
    m.channel.send('Pong!');
  },
};
