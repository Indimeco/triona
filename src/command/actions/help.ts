import { map, pipe, prop, join, isEmpty, length } from "ramda";
import { ActionItem, getActions, getAction } from "."

const listCommands = () => pipe(
    map(getCommandDetail),
    join('\n')
)(getActions());

const getCommandDetail = (action: ActionItem) => `**${prop('command', action)}**: ${prop('desc', action)}`;
const getCommandUsage = (action: ActionItem) => `\`${prop('usage', action)}\``;

export const help: ActionItem = {
    command: 'help',
    desc: 'describe commands Triona can action',
    usage: 'help <command>',
    exec: (message, args) => {
        if (isEmpty(args)) {
            message.channel.send(listCommands(), { split: true })
            return;
        }

        if (length(args) === 1) {
            const action = getAction(args[0]);
            if (action) {
                message.channel.send(`${getCommandDetail(action)}\n${getCommandUsage(action)}`);
                return;
            }
        }

        message.channel.send('Command not found. Use `help` to list available commands.')
        return;
    }
}