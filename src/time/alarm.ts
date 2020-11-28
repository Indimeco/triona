import { Client, MessageEmbed, TextChannel } from 'discord.js';
import { DateTime, Settings } from 'luxon';
import { find } from 'ramda';

import { getDailies } from '../command/actions/dailies';
import { getGuildData } from '../guild';
import { AlarmConfig, GuildData } from '../types';

Settings.throwOnInvalid = true;

export type SystemFnSignature = (data: GuildData) => Promise<(string | MessageEmbed | null)[]>;
export type SystemFunctionItem = { name: string; fn: SystemFnSignature };
const systemFunctions: SystemFunctionItem[] = [
  {
    name: 'test',
    fn: () => Promise.resolve(['success']),
  },
  { name: 'dailies', fn: getDailies },
];

export const getSystemFunction = (name: string) =>
  find((item: SystemFunctionItem) => item.name === name, systemFunctions);

const getWeekDay: (day: string) => number | null = day => {
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
};

export const getAlarmTime = (zone: string, alarm: AlarmConfig) => {
  const [hour, minute] = alarm.time.split(':').map(x => Number(x));

  let restDateConfig = {};
  const weekDay = alarm.day === 'daily' ? DateTime.fromObject({ zone }).weekday : getWeekDay(alarm.day);
  if (weekDay) {
    restDateConfig = { weekDay };
  } else {
    restDateConfig = { day: Number(alarm.day) };
  }

  const alarmDateTime = DateTime.fromObject({
    zone,
    hour,
    minute,
    ...restDateConfig,
  });
  return alarmDateTime;
};

export const shouldFireAlarm = ({ serverTime, alarmTime }: { serverTime: DateTime; alarmTime: DateTime }) => {
  return (
    serverTime.hasSame(alarmTime, 'day') &&
    serverTime.hasSame(alarmTime, 'hour') &&
    serverTime.hasSame(alarmTime, 'minute')
  );
};

export const fireAlarm = async ({
  guildId,
  alarm,
  client,
}: {
  guildId: string;
  alarm: AlarmConfig;
  client: Client;
}) => {
  const guild = client.guilds.cache.find(x => x.id === guildId);
  const channel = guild?.channels.cache.find(x => x.name === alarm.channel);
  // this sort of validation should actually happen on alarm creation, not here
  if (channel?.type !== 'text') return;

  const textChannel = channel as TextChannel;
  if (alarm.message) {
    const role = alarm.role ? `${alarm.role} ` : '';
    textChannel.send(`${role}${alarm.message}`);
  } else if (alarm.systemFunction) {
    const systemFn = getSystemFunction(alarm.systemFunction);
    if (systemFn?.fn) {
      const guildData = await getGuildData(guildId);
      const invokedMessages = await systemFn.fn(guildData);
      invokedMessages.forEach(message => textChannel.send(message));
    }
  }
};

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
