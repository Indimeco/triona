import fetch from 'node-fetch';
import { always, join, split } from 'ramda';
import { MessageEmbed } from 'discord.js';
import { DateTime } from 'luxon';

import { ActionItem } from '../types';
import { getServerTime } from '../../time/time';
import { GuildData } from '../../types';

const apiUrl = always('http://mabi.world/sm/mww/');

export const missionHour = always(7);

export const getMissionSearchDate = (date: DateTime): DateTime => {
  const newMissionHour = 7;
  if (date.hour < newMissionHour) return date.minus({ days: 1 });
  return date;
};

const getUri = (isoDate: string) => {
  return `${apiUrl()}${join('/', split('-', isoDate))}.json`;
};

const constructShadowsMessage = (isoDate: string, tail: string, tara: string) =>
  new MessageEmbed()
    .setColor('082284')
    .setTitle('Daily Shadow Missions')
    .setDescription(isoDate)
    .addFields({ name: 'Tail', value: tail }, { name: 'Tara', value: tara });

const getShadowDailies = async (guildData: GuildData): Promise<string | MessageEmbed> => {
  const failure = "Uhoh, I couldn't find shadow daily information right now~";
  const now = getServerTime(guildData);
  const uri = getUri(getMissionSearchDate(now).toISODate());
  const response = await fetch(uri);

  if (!response.ok) {
    return failure;
  }

  try {
    const {
      Taillteann: { Normal: tailNormal },
      Tara: { Normal: taraNormal },
    } = await response.json();

    return constructShadowsMessage(now.toLocaleString(DateTime.DATETIME_FULL), tailNormal, taraNormal);
  } catch {
    return failure;
  }
};

export const getDailies = async (guildData: GuildData): Promise<(MessageEmbed | string | null)[]> => {
  const shadows = getShadowDailies(guildData);

  return Promise.all([shadows]);
};

export const dailies: ActionItem = {
  command: 'dailies',
  desc: `List current available daily missions`,
  usage: 'dailies',
  exec: async (m, _, guildData) => {
    const dailyMessages = await getDailies(guildData);
    if (!dailyMessages) {
      m.channel.send(`Uhoh, I can't find that information right now~`);
      return;
    }
    dailyMessages.forEach(dailyM => m.channel.send(dailyM));
  },
};
