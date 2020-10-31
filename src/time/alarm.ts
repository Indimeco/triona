import { Client, TextChannel } from 'discord.js';
import { DateTime, Settings } from 'luxon';
import { getGuildData } from '../guild';
import { AlarmConfig } from '../types';

Settings.throwOnInvalid = true;

const getWeekDay: (day: string) => number | null = (day) => {
    const weekDays = {
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
        sunday: 7,
    };

    return weekDays[day as keyof typeof weekDays] ?? null;
}

export const getAlarmTime = (zone: string, alarm: AlarmConfig) => {
    const [hour, minute] = alarm.time.split(":").map(x => Number(x));

    let restDateConfig = {};
    const weekDay = getWeekDay(alarm.day);
    if (weekDay) {
        restDateConfig = { weekDay }
    }
    else {
        restDateConfig = { day: Number(alarm.day) }
    }

    const alarmDateTime = DateTime.fromObject({
        zone: zone,
        hour,
        minute,
        ...restDateConfig,
    });
    return alarmDateTime;
}

export const shouldFireAlarm = ({ serverTime, alarmTime }: { serverTime: DateTime, alarmTime: DateTime }) => {
    return serverTime.hasSame(alarmTime, "day")
        && serverTime.hasSame(alarmTime, 'hour')
        && serverTime.hasSame(alarmTime, 'minute');
}

export const fireAlarm = ({ guildId, alarm, client }: { guildId: string, alarm: AlarmConfig, client: Client }) => {
    const guild = client.guilds.cache.find(x => x.id === guildId);
    const channel = guild?.channels.cache.find(x => x.name === alarm.channel);
    if (channel?.type === "text") {
        const textChannel = channel as TextChannel;
        textChannel.send(`@${alarm.role} ${alarm.message}`);
    }
}

export const checkAlarms = async (client: Client) => {
    const guildIds = client.guilds.cache.map(x => x.id);
    guildIds.forEach(async guildId => {
        const { serverTimezone, alarms } = await getGuildData(guildId);
        alarms.forEach(alarm => {
            const alarmTime = getAlarmTime(serverTimezone, alarm);
            const serverTime = DateTime.fromObject({ zone: serverTimezone });
            if (shouldFireAlarm({ serverTime, alarmTime })) {
                fireAlarm({ guildId, alarm, client });
            }
        });
    });

};