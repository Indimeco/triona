import { DateTime } from 'luxon';
import { AlarmConfig } from '../types';

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
    console.log(alarm);
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