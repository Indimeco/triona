import { DateTime, Settings } from 'luxon';

Settings.throwOnInvalid = true;

export function getServerTime(zone: string): string {
    return DateTime.fromObject({ zone }).toString();
}