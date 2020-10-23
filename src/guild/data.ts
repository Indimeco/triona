import { guildDataFileFactory, guildDataFileWriter } from './fs';
import { GetGuildDataFactory, WriteGuildDataFactory } from './types';

export const getGuildData: GetGuildDataFactory = guildDataFileFactory;

export const writeGuildData: WriteGuildDataFactory = guildDataFileWriter;