import { isNil, match, toLower, unless } from 'ramda';

const commandRegex = (prefix: string) => new RegExp(`^${prefix}([\\w\\d]+)`, 'i');

export const getArgs = (message: string): string[] => match(
    /(?<=\s)[\w\d]+/ig,
    message
);

export const getCommand = (prefix: string, message: string): string | null => {
    const matchResult = match(
        commandRegex(prefix),
        message,
    );
    const formatMatch = unless(isNil, toLower);
    return formatMatch(matchResult[1]);
}