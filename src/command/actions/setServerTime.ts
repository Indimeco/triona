import { DateTime } from 'luxon';

import { ActionItem } from '../types';
import { SetServerZoneAction } from '../../guild';

export const setServerTime: ActionItem = {
  command: 'setservertime',
  desc: `Change the timezone used by the server`,
  usage: 'setservertime <utc_offset>',
  example: 'setsevertime -4:00',
  exec: (m, args) => {
    const [offset] = args;

    try {
      const signedOffset = ['-', '+'].includes(offset.charAt(0)) ? offset : `+${offset}`;
      const newZone = `UTC${signedOffset}`;
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
      m.channel.send(err);
      m.channel.send('See UTC offsets: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones');
    }
  },
};
