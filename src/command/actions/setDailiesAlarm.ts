import { ActionItem } from '../types';
import { AlarmConfig, AlarmFrequency } from '../../types';
import { SetAlarmAction } from '../../guild';
import { getAlarmTime } from '../../time/alarm';
import { sendMessage } from '../../sendMessage';

import { missionHour } from './dailies';

export const setDailiesAlarm: ActionItem = {
  command: 'setdailiesalarm',
  desc: `Create an alarm which posts daily missions`,
  usage: 'setdailiesalarm <channel>',
  example: 'setdailiesalarm general',
  exec: (m, [channel]) => {
    try {
      if (!channel) {
        throw new Error('Insufficient arguments');
      }

      const dailiesAlarm: AlarmConfig = {
        name: 'triona_dailies',
        frequency: AlarmFrequency.daily,
        day: 'daily',
        time: `${missionHour()}:00`,
        channel,
        systemFunction: 'dailies',
      };

      const alarmTime = getAlarmTime('UTC+0', dailiesAlarm);
      if (!alarmTime.isValid) {
        throw new Error(`${alarmTime.invalidExplanation}`);
      }

      const dispatch: SetAlarmAction = {
        name: 'setalarm',
        value: dailiesAlarm,
      };
      return dispatch;
    } catch (err) {
      sendMessage(m, `${err}! Try \`help setdailiesalarm\` for usage.`);
      return undefined;
    }
  },
};
