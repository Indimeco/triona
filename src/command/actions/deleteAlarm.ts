import { ActionItem } from "../types";
import { DeleteAlarmAction } from '../../guild';
import { find, propEq } from "ramda";

export const deleteAlarm: ActionItem = {
    command: 'deletealarm',
    desc: `Delete a specified alarm`,
    usage: 'deletealarm <unique_name>',
    example: 'deletealarm danceparty',
    exec: (m, args, { alarms }) => {
        const [name] = args;

        const alarm = find(
            propEq('name', name),
            alarms
        );

        if (alarm) {
            const dispatch: DeleteAlarmAction = {
                name: 'deletealarm',
                value: name
            };
            return dispatch;
        }
        else {
            m.channel.send('You do not have an alarm with that name~');
        }
    }
}