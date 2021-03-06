import { DateTimeFormatOptions } from 'luxon';

import { ActionItem } from '../types';
import { getServerTime } from '../../time/time';
import { sendMessage } from '../../sendMessage';

export const serverTime: ActionItem = {
  command: 'servertime',
  desc: `Displays current configured server time`,
  usage: 'servertime',
  exec: (m, args, guildData) => {
    const timeFormat: DateTimeFormatOptions = {
      weekday: 'long',
      hour: 'numeric',
      minute: '2-digit',
      hour12: false,
    };
    const time = getServerTime(guildData).toLocaleString(timeFormat);
    sendMessage(m, `Current server time: ${time}`);
  },
};
