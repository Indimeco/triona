import { join, isEmpty } from 'ramda';

import { ActionItem } from '../types';
import { AlarmConfig, AlarmFrequency } from '../../types';
import { SetAlarmAction } from '../../guild';
import { getAlarmTime } from '../../time/alarm';
import { sendMessage } from '../../sendMessage';

const isMention = (mention: string) => /^<@!?&?(\d+)>$|^@(everyone|here)$/.test(mention);

export const setAlarm: ActionItem = {
  command: 'setalarm',
  desc: `Create an alarm for a specific server time`,
  usage:
    'setalarm <unique_name> <daily|weekly|monthly> <daily|day_of_week|day_of_month> <24_hour_time> <channel> <role> <message>',
  example: 'setalarm danceparty weekly tuesday 22:00 general @indimeco Come and dance together!',
  exec: (m, args) => {
    const [name, frequency, day, time, channel, role, ...messageWords] = args;

    try {
      if (!name || !frequency || !day || !time || !channel || !role || isEmpty(messageWords)) {
        throw new Error('Insufficient arguments');
      }

      const message = join(' ', messageWords);

      if (!isMention(role)) {
        throw new Error(`${role} is not a user or group. Please try a different role`);
      }

      const newAlarm: AlarmConfig = {
        name,
        frequency: AlarmFrequency[frequency as keyof typeof AlarmFrequency],
        day,
        time,
        channel,
        role,
        message,
      };

      const alarmTime = getAlarmTime('UTC+0', newAlarm);
      if (!alarmTime.isValid) {
        throw new Error(`${alarmTime.invalidExplanation}`);
      }

      const dispatch: SetAlarmAction = {
        name: 'setalarm',
        value: newAlarm,
      };
      return dispatch;
    } catch (err) {
      sendMessage(m, `${err}! Try \`help setalarm\` for usage.`);
      return undefined;
    }
  },
};
