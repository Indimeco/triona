import { DateTime } from 'luxon';

import { getMissionSearchDate } from './dailies';

describe('dailies', () => {
  it('gets correct mission day after misson hour', () => {
    const now = DateTime.fromObject({
      year: 2000,
      month: 12,
      day: 31,
      hour: 10,
      minute: 30,
    });
    const missionTime = getMissionSearchDate(now);
    expect(missionTime).toStrictEqual(now);
  });

  it('gets correct mission day before misson hour', () => {
    const now = DateTime.fromObject({
      year: 2000,
      month: 12,
      day: 31,
      hour: 3,
      minute: 30,
    });

    const dayBefore = DateTime.fromObject({
      year: 2000,
      month: 12,
      day: 30,
      hour: 3,
      minute: 30,
    });

    const missionTime = getMissionSearchDate(now);
    expect(missionTime).toStrictEqual(dayBefore);
  });
});
