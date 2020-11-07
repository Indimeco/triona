import { ping } from './actions';
import { getAction } from './getAction';
import { getCommand, getArgs } from './parse';

describe('command parsing', () => {
  it('understands if a message begins with a command', () => {
    const commandMsg = '~ping';
    expect(getCommand('~', commandMsg)).toStrictEqual('ping');
  });

  it('rejects messages that do not begin with commands', () => {
    const commandMsg = '!blah';
    expect(getCommand('~', commandMsg)).toBeNull();
  });
});

describe('command argument parsing', () => {
  it('parses arguments after a command', () => {
    const commandMsg = '~help argument1 argument2';
    expect(getArgs(commandMsg)).toStrictEqual(['argument1', 'argument2']);
  });

  it('parses arguments with special characters', () => {
    const commandMsg = '~message Hey! Everyone yell @person123 <3';
    expect(getArgs(commandMsg)).toStrictEqual(['Hey!', 'Everyone', 'yell', '@person123', '<3']);
  });
});

describe('get action', () => {
  it('gets correct action', () => {
    expect(getAction('ping')).toStrictEqual(ping);
  });

  it('derives correct action from command', () => {
    const commandMsg = '~ping';
    expect(getAction(getCommand('~', commandMsg))).toBe(ping);
  });
});
