import { DateTime, Settings } from 'luxon';
import { config } from '../config';

Settings.throwOnInvalid = true;

export function getServerTime(): string {
    return DateTime.fromObject({ zone: config.SERVER_TIMEZONE }).toString();
}