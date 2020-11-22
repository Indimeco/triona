import fetch from 'node-fetch';
import { always, join, split } from 'ramda';
import { MessageEmbed } from 'discord.js';
import { DateTime } from 'luxon';

import { ActionItem } from '../types';
import { getServerTime } from '../../time/time';

const apiUrl = always('http://mabi.world/sm/mww/');

export const getMissionSearchDate = (date: DateTime): DateTime => {
  const newMissionHour = 7;
  if (date.hour < newMissionHour) return date.minus({ days: 1 });
  return date;
};

const getUri = (isoDate: string) => {
  return `${apiUrl()}${join('/', split('-', isoDate))}.json`;
};

const getShadowDailies = (isoDate: string, tail: string, tara: string) =>
  new MessageEmbed()
    .setColor('082284')
    .setTitle('Daily Shadow Missions')
    .setDescription(isoDate)
    .addFields({ name: 'Tail', value: tail }, { name: 'Tara', value: tara });

export const dailies: ActionItem = {
  command: 'dailies',
  desc: `List current available daily missions`,
  usage: 'dailies',
  exec: async (m, _, guildData) => {
    const now = getServerTime(guildData);
    const uri = getUri(getMissionSearchDate(now).toISODate());
    const response = await fetch(uri);

    if (!response.ok) {
      m.channel.send(`Uhoh, I can't find that information right now~`);
      return;
    }

    try {
      const {
        Taillteann: { Normal: tailNormal },
        Tara: { Normal: taraNormal },
      } = await response.json();
      m.channel.send(getShadowDailies(now.toLocaleString(DateTime.DATETIME_FULL), tailNormal, taraNormal));
    } catch {
      m.channel.send('Uhoh, my information source returned an invalid response~');
    }
  },
};
