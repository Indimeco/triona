import { AlarmConfig, AlarmOccurence } from '../types';

export const alarms: AlarmConfig[] = [
    {
        name: "Jousting",
        occurrence: AlarmOccurence.daily,
        time: "1:00",
        message: "Get ready for the jousting tournament!",
        role: "@here",
        channel: '#bots',
    }
]