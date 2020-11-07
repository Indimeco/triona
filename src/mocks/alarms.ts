import { AlarmConfig, AlarmFrequency } from '../types';

export const alarms: AlarmConfig[] = [
  {
    name: 'Jousting',
    frequency: AlarmFrequency.daily,
    day: 'tuesday',
    time: '1:00',
    message: 'Get ready for the jousting tournament!',
    role: '@here',
    channel: '#bots',
  },
];
