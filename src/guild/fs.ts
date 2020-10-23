import { resolve } from 'path';
import { andThen, pipe, invoker } from 'ramda';
import { GuildData } from '../types';
import { config, ConfigSchema } from '../config';
import { PathLike, promises } from 'fs';
import { GetGuildDataFactory, WriteGuildDataFactory } from './types';
const { readFile, stat, mkdir, writeFile } = promises;

/**
 * This should fs module should be revisted with either callbacks or futures
 * because Ramda doesn't play nice with fs promises
 * and the implicit dependency on `config` adds some unintuitive side effects
 */


const getGuildFileName = (config: ConfigSchema, guildId: string) => `${config.dataPath}/${guildId}.json`


async function exists(path: PathLike) {
    try {
        const f = await stat(path);
        if (f) return true;
    }
    catch (e) {
        return false;
    }
}

async function initData(config: ConfigSchema) {
    const hasData = await exists(config.dataPath);

    if (!hasData) {
        return mkdir(config.dataPath);
    }
}

async function initGuild(config: ConfigSchema, guildId: string) {
    const path = getGuildFileName(config, guildId);
    const hasGuild = await exists(path);

    const emptyGuild: GuildData = {
        serverTimezone: 'UTC+0',
        alarms: [],
    }

    if (!hasGuild) {
        return writeFile(path, JSON.stringify(emptyGuild))
    }
}

const getGuildDataFromFile = (config: ConfigSchema, guildId: string): () => Promise<GuildData> =>
    pipe(
        () => getGuildFileName(config, guildId),
        resolve,
        readFile,
        andThen(
            pipe(
                invoker(0, 'toString'),
                JSON.parse
            )
        ),
    );

const writeGuildDataToFile = async (config: ConfigSchema, guildId: string, data: GuildData) => {
    const path = resolve(getGuildFileName(config, guildId));
    return writeFile(path, JSON.stringify(data));
}

export const guildDataFileWriter: WriteGuildDataFactory = async (guildId: string, data: GuildData) => {
    return writeGuildDataToFile(config, guildId, data);
}

export const guildDataFileFactory: GetGuildDataFactory = async (guildId: string) => {
    await initData(config);
    await initGuild(config, guildId);

    return getGuildDataFromFile(config, guildId)();
}