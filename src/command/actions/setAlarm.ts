import { ActionItem } from "."
import { AlarmConfig, AlarmOccurence } from "../../types";
import { SetAlarmAction } from '../../guild';
import { empty, join, isEmpty } from "ramda";

export const setAlarm: ActionItem = {
    command: 'setalarm',
    desc: `Create an alarm for a specific server time`,
    usage: 'setalarm <name> <once|daily|weekly|monthly> <24_hour_time> <channel> <role> <message>',
    exec: (m, args) => {
        const [name, occurrence, time, channel, role, ...messageWords] = args;
        if (!name || !occurrence || !time || !channel || !role || isEmpty(messageWords)) {
            m.channel.send("I don't understand. Try `help setalarm` for details.");
            return;
        }

        const message = join(' ', messageWords);

        const newAlarm: AlarmConfig = {
            name,
            occurrence: AlarmOccurence[occurrence as keyof typeof AlarmOccurence],
            time,
            channel,
            role,
            message
        };
        const dispatch: SetAlarmAction = {
            name: 'setalarm',
            value: newAlarm
        };
        return dispatch;
    }
}