import { AlarmConfig, GuildData } from '../types';

import { guildDataFileFactory, guildDataFileWriter } from './fs';
import { GetGuildDataFactory, WriteGuildDataFactory } from './types';

export const getGuildData: GetGuildDataFactory = guildDataFileFactory;

export const writeGuildData: WriteGuildDataFactory = guildDataFileWriter;

export type SetAlarmAction = {
  name: 'setalarm';
  value: AlarmConfig;
};

export type DeleteAlarmAction = {
  name: 'deletealarm';
  value: string;
};

export type SetServerZoneAction = {
  name: 'setservertime';
  value: string;
};

export type GuildDataDispatch = SetAlarmAction | DeleteAlarmAction | SetServerZoneAction;

export const modifyGuildData: (prevGuildData: GuildData, action: GuildDataDispatch) => GuildData = (
  prevGuildData,
  { name, value },
) => {
  switch (name) {
    case 'setalarm':
      const newAlarm = value as AlarmConfig;
      return {
        ...prevGuildData,
        alarms: [...prevGuildData.alarms.filter(alarm => alarm.name !== newAlarm.name), newAlarm],
      };

    case 'deletealarm':
      const alarmToDelete = value as string;
      return {
        ...prevGuildData,
        alarms: [...prevGuildData.alarms.filter(alarm => alarm.name !== alarmToDelete)],
      };

    case 'setservertime':
      const newOffset = value as string;
      return {
        ...prevGuildData,
        serverTimezone: newOffset,
      };
  }
};
