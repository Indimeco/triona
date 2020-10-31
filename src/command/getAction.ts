import { find, propEq, toLower } from 'ramda';
import { ActionItem, Actions } from './types';

import { ping, help, setAlarm, setServerTime, serverTime } from './actions';

export const getAction = (command: string) => find<ActionItem>(
    propEq('command', toLower(command))
)(getActions());

export const getActions: () => Actions = () => [
    ping,
    help,
    setAlarm,
    setServerTime,
    serverTime
]