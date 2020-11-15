import { isNil, find, propEq, toLower, ifElse, always } from 'ramda';

import { ActionItem, Actions } from './types';
// eslint-disable-next-line import/no-cycle
import { ping, help, setAlarm, setServerTime, serverTime, listAlarms, deleteAlarm } from './actions';

export const getActions: () => Actions = () => [
  ping,
  help,
  setAlarm,
  setServerTime,
  serverTime,
  listAlarms,
  deleteAlarm,
];

export const getAction: (command?: string | null) => ActionItem | null = ifElse(isNil, always(null), (c: string) =>
  find<ActionItem>(propEq('command', toLower(c)))(getActions()),
);
