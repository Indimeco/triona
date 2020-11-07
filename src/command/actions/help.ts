import { map, pipe, prop, join, isEmpty, length } from 'ramda';

import { getActions, getAction } from '../getAction';
import { ActionItem } from '../types';

const listCommands = () => pipe(map(getCommandDetail), join(''))(getActions());

const getCommandDetail = (action: ActionItem) => `**${prop('command', action)}**: ${prop('desc', action)}\n`;
const getCommandUsage = (action: ActionItem) => `\`${prop('usage', action)}\`\n`;
const getCommandExample = ({ example }: ActionItem) => (example ? `\nExample: \`${example}\`\n` : '');

export const help: ActionItem = {
  command: 'help',
  desc: 'describe commands Triona can action',
  usage: 'help <command>',
  exec: (message, args) => {
    if (isEmpty(args)) {
      message.channel.send(listCommands(), { split: true });
      return;
    }

    if (length(args) === 1) {
      const action = getAction(args[0]);
      if (action) {
        message.channel.send(`${getCommandDetail(action)}${getCommandUsage(action)}${getCommandExample(action)}`);
        return;
      }
    }

    message.channel.send('Command not found. Use `help` to list available commands.');
  },
};
