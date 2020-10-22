import { GuildData } from '../types';

export type GetGuildDataFactory = (guildId: string) => Promise<GuildData>;
