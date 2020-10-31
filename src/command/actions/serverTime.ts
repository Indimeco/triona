import { ActionItem } from "../types";
import { getServerTime } from "../../time/time";
import { DateTimeFormatOptions, DateTime } from 'luxon';

export const serverTime: ActionItem = {
    command: 'servertime',
    desc: `Displays current configured server time`,
    usage: 'servertime',
    exec: (m, args, guildData) => {
        const timeFormat: DateTimeFormatOptions = {
            weekday: "long",
            hour: "numeric",
            minute: "2-digit",
            hour12: false
        }
        const time = getServerTime(guildData).toLocaleString(timeFormat);
        m.channel.send(`Current server time: ${time}`);
    }
}