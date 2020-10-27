import { AlarmConfig, GuildData } from '../types';
import { guildDataFileFactory, guildDataFileWriter } from './fs';
import { GetGuildDataFactory, WriteGuildDataFactory } from './types';

export const getGuildData: GetGuildDataFactory = guildDataFileFactory;

export const writeGuildData: WriteGuildDataFactory = guildDataFileWriter;

export type SetAlarmAction = {
    name: 'setalarm',
    value: AlarmConfig,
}

export type GuildDataAction = SetAlarmAction

export const modifyGuildData: (prevGuildData: GuildData, action: GuildDataAction) => GuildData = (prevGuildData, { name, value }) => {
    switch (name) {
        case 'setalarm':
            const newAlarm = value as AlarmConfig;
            return {
                ...prevGuildData,
                alarms: [
                    ...prevGuildData.alarms,
                    newAlarm
                ]
            };
    }
}