import { DateTime } from 'luxon';
import { GuildData } from '../types';

export const getServerTime = ({ serverTimezone }: GuildData) => DateTime.fromObject({ zone: serverTimezone });
