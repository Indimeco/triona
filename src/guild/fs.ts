import { resolve } from 'path';
import { PathLike, promises } from 'fs';

import { andThen, pipe, invoker } from 'ramda';

import { GuildData } from '../types';
import { config, ConfigSchema } from '../config';

import { GetGuildDataFactory, WriteGuildDataFactory } from './types';

const { readFile, stat, mkdir, writeFile } = promises;

/**
 * This should fs module should be revisted with either callbacks or futures
 * because Ramda doesn't play nice with fs promises
 * and the implicit dependency on `config` adds some unintuitive side effects
 */

const getGuildFileName = (c: ConfigSchema, guildId: string) => `${c.dataPath}/${guildId}.json`;

async function exists(path: PathLike) {
  try {
    const f = await stat(path);
    if (f) return true;
    return false;
  } catch (e) {
    return false;
  }
}

async function initData(c: ConfigSchema) {
  const hasData = await exists(c.dataPath);

  if (!hasData) {
    return mkdir(c.dataPath);
  }

  return null;
}

async function initGuild(c: ConfigSchema, guildId: string) {
  const path = getGuildFileName(c, guildId);
  const hasGuild = await exists(path);

  const emptyGuild: GuildData = {
    serverTimezone: 'America/New_York',
    alarms: [],
  };

  if (!hasGuild) {
    return writeFile(path, JSON.stringify(emptyGuild));
  }

  return null;
}

const getGuildDataFromFile = (c: ConfigSchema, guildId: string): (() => Promise<GuildData>) =>
  pipe(() => getGuildFileName(c, guildId), resolve, readFile, andThen(pipe(invoker(0, 'toString'), JSON.parse)));

const writeGuildDataToFile = async (c: ConfigSchema, guildId: string, data: GuildData) => {
  const path = resolve(getGuildFileName(c, guildId));
  return writeFile(path, JSON.stringify(data));
};

export const guildDataFileWriter: WriteGuildDataFactory = async (guildId: string, data: GuildData) => {
  return writeGuildDataToFile(config, guildId, data);
};

export const guildDataFileFactory: GetGuildDataFactory = async (guildId: string) => {
  await initData(config);
  await initGuild(config, guildId);

  return getGuildDataFromFile(config, guildId)();
};
