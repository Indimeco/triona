import dedent from 'dedent-js';

import { ActionItem } from '../types';

export const about: ActionItem = {
  command: 'about',
  desc: `Information about feature requests and contributions`,
  usage: 'about',
  exec: m => {
    const info = dedent`
    **View Source Code:** <https://github.com/Indimeco/triona>

    **Submit Bug Report or Feature Request:** <https://github.com/Indimeco/triona/issues/new>
    `;
    m.channel.send(info);
  },
};
