import { GuildData } from '../../types';

import { help, helpError } from './help';
import { ping } from './ping';

const fakeMessage: any = {
  channel: {
    send: jest.fn().mockImplementation(() => Promise.resolve()),
  },
};

const fakeGuildData: GuildData = {
  serverTimezone: 'America/New_York',
  alarms: [],
};

describe('help exec', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('lists commands', () => {
    help.exec(fakeMessage, [], fakeGuildData);

    expect(fakeMessage.channel.send).toHaveBeenCalledTimes(1);
    const sentMessage = fakeMessage.channel.send.mock.calls[0][0];
    expect(sentMessage).toContain(help.desc);
    expect(sentMessage).toContain(ping.desc);
    expect(sentMessage).not.toContain(helpError);
  });

  it('details specific command', () => {
    help.exec(fakeMessage, ['ping'], fakeGuildData);

    expect(fakeMessage.channel.send).toHaveBeenCalledTimes(1);
    const sentMessage = fakeMessage.channel.send.mock.calls[0][0];
    expect(sentMessage).toContain(ping.usage);
    expect(sentMessage).toContain(ping.desc);
    expect(sentMessage).not.toContain(help.desc);
  });
});
