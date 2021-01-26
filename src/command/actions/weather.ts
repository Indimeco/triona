import fetch from 'node-fetch';
import { join, map, pipe } from 'ramda';
import { MessageEmbed } from 'discord.js';

import { ActionItem } from '../types';
import { sendMessage } from '../../sendMessage';
import { getServerTime } from '../../time/time';

const getApiUrl = (from: string) => `http://mabi.world/api/forecast/?duration=3&from=${from}`;

enum Locations {
  type1 = 'Tir, Dugald',
  type2 = 'Dun, Gairech, Cobh',
  type3 = 'Bangor',
  type4 = 'Emain Macha',
  type5 = 'Sen Mag',
  type6 = 'Port Cean, Morva Aisle',
  type7 = 'Rano, Nubes',
  type8 = 'Connous',
  type9 = 'Courcle',
  type10 = 'Physis, Zardine',
  type11 = 'Shadow Realm',
  type12 = 'Tail, Tara',
  type13 = 'Unknown',
}
enum Weather {
  SUNNY = 'sunny',
  CLOUDY = 'cloudy',
  SPRINKLING = 'sprinkling',
  RAINY = 'rainy',
  THUNDER = 'thunder',
}
type ForecastTypes = keyof typeof Locations;
type Forecast = { [key in ForecastTypes]: number[] };
type ForecastResponse = { from: string; forecast: Forecast };

const getWeatherFromInt = (i: number) => {
  if (i <= -5) return Weather.SUNNY;
  if (i <= -1) return Weather.CLOUDY;
  if (i <= 10) return Weather.SPRINKLING;
  if (i <= 19) return Weather.RAINY;
  return Weather.THUNDER;
};

const getEmojiFromWeather = (weather: Weather) => {
  if (weather === Weather.CLOUDY) return ':cloud:';
  if (weather === Weather.SPRINKLING) return ':white_sun_rain_cloud:';
  if (weather === Weather.RAINY) return ':cloud_rain:';
  if (weather === Weather.THUNDER) return ':thunder_cloud_rain:';
  if (weather === Weather.SUNNY) return ':sunny:';
  throw new Error(`Unhandled weather type: ${weather}`);
};
const getWeatherDisplay = pipe(getWeatherFromInt, getEmojiFromWeather);

const constructForecastMessage = ({ forecast }: ForecastResponse, time: string) =>
  new MessageEmbed()
    .setColor('082284')
    .setTitle('Weather Forecast')
    .setDescription('Next hour in 20 minute intervals')
    .addFields(
      map(
        ([area, weathers]) => ({
          name: Locations[area as ForecastTypes],
          value: join(' / ', map(getWeatherDisplay, weathers)),
          inline: true,
        }),
        Object.entries(forecast),
      ),
    )
    .setFooter(time);

const getWeather = async (time: string): Promise<string | MessageEmbed> => {
  const failure = "Uhoh, I couldn't find weather information right now~";
  const response = await fetch(getApiUrl(time));

  if (!response.ok) {
    return failure;
  }

  try {
    const resp: ForecastResponse = await response.json();
    return constructForecastMessage(resp, time);
  } catch {
    return failure;
  }
};

export const weather: ActionItem = {
  command: 'weather',
  desc: `List weather forecast across regions`,
  usage: 'weather',
  exec: async (m, _, guildData) => {
    const now = getServerTime(guildData).toISO({
      suppressMilliseconds: true,
      suppressSeconds: true,
      includeOffset: false,
      format: 'extended',
    });
    const forecast = await getWeather(now);
    if (!forecast) {
      sendMessage(m, `Uhoh, I can't find that information right now~`);
      return;
    }
    sendMessage(m, forecast);
  },
};
