import { map, pipe, prop, join, isEmpty } from "ramda";
import { ActionItem, getActions } from "."

export const help: ActionItem = {
    command: 'help',
    desc: 'describe commands Triona can action',
    usage: 'help <command>',
    exec: (message, args) => {
        console.log(args);
        if (isEmpty(args)) {
            const allCommands = pipe(
                map(
                    (action: ActionItem) => `**${prop('command', action)}:** ${prop('desc', action)}`
                ),
                join('\n')
            )(getActions());
            message.channel.send(allCommands, { split: true })
        }
    }
}