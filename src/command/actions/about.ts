import dedent from 'dedent-js';

import { sendMessage } from '../../sendMessage';
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
    sendMessage(m, info);
  },
};
