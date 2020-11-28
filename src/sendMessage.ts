import { Message, MessageEmbed } from 'discord.js';

export const sendMessage = (m: Message, content: string | MessageEmbed | null, opts?: any) => {
  m.channel
    .send(content, opts)
    .catch(() => m.author.send('I just failed to send a message. Please check my permissions~'));
};
