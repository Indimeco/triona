import { ActionItem } from "../types";
import { AlarmConfig } from "../../types";
import { join, map } from "ramda";
import dedent from 'dedent-js';

export const listAlarms: ActionItem = {
    command: 'listalarms',
    desc: `List all alarms configured in this discord server`,
    usage: 'listalarms',
    exec: (m, _, { alarms }) => {
        const getAlarmString = ({ name, frequency, time, day, role, channel, message }: AlarmConfig) => dedent`
            **${name}**
            frequency: ${frequency}
            ${day !== 'daily' && 'day: ' + day}
            time: ${time}
            role: ${role}
            channel: ${channel}
            message: ${message}
            ---
        `;

        const alarmList = join('\n', map(getAlarmString, alarms));

        if (alarmList) {
            m.channel.send(alarmList);
        }
        else {
            m.channel.send('You do not have any alarms configured~');
        }
    }
}