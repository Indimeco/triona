import fetch from 'node-fetch';
import { always, find, join, split } from 'ramda';
import { MessageEmbed } from 'discord.js';
import { DateTime } from 'luxon';

import { ActionItem } from '../types';
import { getServerTime } from '../../time/time';
import { GuildData } from '../../types';
import { sendMessage } from '../../sendMessage';

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

type MissionData = { name: string; party: string };
export const getShadowData = (name: string): MissionData | undefined =>
  find((data: MissionData) => data.name === name, [
    { name: 'The Stones of Sliab Cuilin', party: '1~2' },
    { name: 'Conflict! An Unexpected Battle', party: '3~4' },
    { name: 'Defeat the Shadow Warrior', party: '1' },
    { name: 'Battle for Taillteann II', party: '1~3' },
    { name: 'Rescue the Scout', party: '2~4' },
    { name: 'Battle for Taillteann I', party: '1~4' },
    { name: 'Defeat Fomor Commander I', party: '1~2' },
    { name: 'Offering', party: '1~4' },
    { name: 'Provocation', party: '3' },
    { name: 'Defeat Fomor Commander II', party: '1~3' },
    { name: 'Taillteann Defensive Battle', party: '3~6' },
    { name: 'Defeat the Shadow Wizard', party: '1~8' },
    { name: "Dorren's Request", party: '1~3' },
    { name: 'Shadow Cast City', party: '1~3' },
    { name: 'Enemy Behind', party: '1~2' },
    { name: 'Their Method', party: '1' },
    { name: 'Lingering Darkness', party: '1~3' },
    { name: 'Protect Corrib Valley', party: '1~2' },
    { name: 'The Smell of Wine', party: '1' },
    { name: 'Mobilizing the Expeditionary Force', party: '1~3' },
    { name: 'The Other Alchemists', party: '1~4' },
    { name: 'Fomor Attack', party: '1~5' },
    { name: 'Ghost of Partholon', party: '1~5' },
    { name: 'The Sulfur Spider inside Shadow Realm', party: '1~8' },
  ]);

const getShadowDescription = (name: string) => {
  const data = getShadowData(name);
  const partyStr = data?.party ? `(${data.party})` : '';
  return `${name} ${partyStr}`;
};

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
      Taillteann: { Normal: tailName },
      Tara: { Normal: taraName },
    } = await response.json();

    const tail = getShadowDescription(tailName);
    const tara = getShadowDescription(taraName);

    return constructShadowsMessage(now.toLocaleString(DateTime.DATETIME_FULL), tail, tara);
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
      sendMessage(m, `Uhoh, I can't find that information right now~`);
      return;
    }
    dailyMessages.forEach(dailyM => sendMessage(m, dailyM));
  },
};
