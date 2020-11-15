import { isNil, find, propEq, toLower, ifElse, always } from 'ramda';

import { ActionItem, Actions } from './types';
// eslint-disable-next-line import/no-cycle
import { ping, help, setAlarm, setServerTime, serverTime, listAlarms, deleteAlarm, about } from './actions';

export const getActions: () => Actions = () => [
  ping,
  help,
  setAlarm,
  setServerTime,
  serverTime,
  listAlarms,
  deleteAlarm,
  about,
];

export const getAction: (command?: string | null) => ActionItem | null = ifElse(isNil, always(null), (c: string) =>
  find<ActionItem>(propEq('command', toLower(c)))(getActions()),
);
