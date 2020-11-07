import { unless, isNil, find, propEq, toLower, ifElse, always } from 'ramda';
import { ActionItem, Actions } from './types';

import { ping, help, setAlarm, setServerTime, serverTime } from './actions';

export const getAction: (command?: string | null) => ActionItem | null = ifElse(
    isNil,
    always(null),
    (c: string) => find<ActionItem>(
        propEq('command', toLower(c))
    )(getActions())
);

export const getActions: () => Actions = () => [
    ping,
    help,
    setAlarm,
    setServerTime,
    serverTime
]