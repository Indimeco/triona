import { DateTime, Settings } from 'luxon';

import { AlarmConfig, AlarmFrequency } from '../types';

import { getAlarmTime, shouldFireAlarm } from './alarm';

const genericAlarm: AlarmConfig = {
  name: 'Test',
  frequency: AlarmFrequency.weekly,
  day: 'daily',
  time: '10:30',
  message: 'this is a drill',
  role: '@here',
  channel: '#bots',
};

describe('gets correct alarm time from an alarm config', () => {
  beforeAll(() => {
    Settings.now = () => Date.UTC(1991, 2, 27);
  });

  it('reads alarm config for daily alarm', () => {
    const time = getAlarmTime('UTC+0', genericAlarm);
    const expectedTime = DateTime.fromObject({
      zone: 'UTC+0',
      minute: 30,
      hour: 10,
      day: 27,
      month: 3,
      year: 1991,
    });
    expect(time).toStrictEqual(expectedTime);
    expect(shouldFireAlarm({ serverTime: expectedTime, alarmTime: time })).toStrictEqual(true);
  });

  it('reads alarm config for weekly alarm with future weekday', () => {
    const alarm: AlarmConfig = { ...genericAlarm, frequency: AlarmFrequency.weekly, day: 'thursday' };
    const time = getAlarmTime('UTC+0', alarm);
    expect(time).toStrictEqual(
      DateTime.fromObject({
        zone: 'UTC+0',
        minute: 30,
        hour: 10,
        day: 28,
        month: 3,
        year: 1991,
      }),
    );
  });

  /**
   * currently there's a dependency on Luxon to always return a relevant DateTime for the given week
   * if the day references a day in the past of the current week, i.e., "tuesday" but it is currently "wednesday"
   * then luxon says it's in the past and the alarm doesn't fire
   * if the day references a day in the future, i.e., "tuesday" and it's currently "monday"
   * then luxon says it's in the future and the alarm will fire accordingly
   *
   * should resolve this dependency or at least make it more explicit
   * then the following test should pass
   */
  xit('reads alarm config for weekly alarm with past weekday', () => {
    const alarm: AlarmConfig = { ...genericAlarm, frequency: AlarmFrequency.weekly, day: 'monday' };
    const time = getAlarmTime('UTC+0', alarm);
    expect(time).toStrictEqual(
      DateTime.fromObject({
        zone: 'UTC+0',
        minute: 30,
        hour: 10,
        day: 1,
        month: 4,
        year: 1991,
      }),
    );
  });

  it('reads alarm config for monthly alarm', () => {
    const alarm: AlarmConfig = { ...genericAlarm, frequency: AlarmFrequency.monthly, day: '31' };

    const time = getAlarmTime('UTC+0', alarm);
    expect(time).toStrictEqual(
      DateTime.fromObject({
        zone: 'UTC+0',
        minute: 30,
        hour: 10,
        day: 31,
        month: 3,
        year: 1991,
      }),
    );
  });
});
