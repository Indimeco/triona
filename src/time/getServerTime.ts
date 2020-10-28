import { DateTime, Settings } from 'luxon';
import { GuildData } from '../types';

Settings.throwOnInvalid = true;

export function getServerTime(guildData: GuildData): string {
    return DateTime.fromObject({ zone: guildData.serverTimezone }).toString();
}