import { GuildData } from '../types';

export type GetGuildDataFactory = (guildId: string) => Promise<GuildData>;

export type WriteGuildDataFactory = (guildId: string, data: GuildData) => void;
