import { map, pipe, prop, join } from 'ramda';

// eslint-disable-next-line import/no-cycle
import { getActions, getAction } from '../getAction';
import { ActionItem } from '../types';
import { sendMessage } from '../../sendMessage';

const getCommandDetail = (action: ActionItem) => `**${prop('command', action)}**: ${prop('desc', action)}\n`;
const listCommands = () => pipe(map(getCommandDetail), join(''))(getActions());
const getCommandUsage = (action: ActionItem) => `\`${prop('usage', action)}\`\n`;
const getCommandExample = ({ example }: ActionItem) => (example ? `\nExample: \`${example}\`\n` : '');

export const helpError = 'Command not found. Use `help` to list available commands~';
export const help: ActionItem = {
  command: 'help',
  desc: 'describe commands Triona can action',
  usage: 'help <command>',
  exec: (message, [command]) => {
    if (!command) {
      sendMessage(message, listCommands(), { split: true });
      return;
    }

    const action = getAction(command);
    if (action) {
      sendMessage(message, `${getCommandDetail(action)}${getCommandUsage(action)}${getCommandExample(action)}`);
      return;
    }

    sendMessage(message, helpError);
  },
};
