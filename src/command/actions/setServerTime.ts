import { DateTime } from 'luxon';

import { ActionItem } from '../types';
import { SetServerZoneAction } from '../../guild';

export const setServerTime: ActionItem = {
  command: 'setservertime',
  desc: `Change the timezone used by the server`,
  usage: 'setservertime <timezone_name>',
  example: 'setsevertime America/New_York',
  exec: (m, args) => {
    const [newZone] = args;

    try {
      const newTime = DateTime.fromObject({ zone: newZone });

      if (!newTime.isValid) {
        throw new Error(`${newTime.invalidExplanation}`);
      }

      const dispatch: SetServerZoneAction = {
        name: 'setservertime',
        value: newZone,
      };
      return dispatch;
    } catch (err) {
      m.channel.send(`${err}, see timezones: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones`);
      return undefined;
    }
  },
};
