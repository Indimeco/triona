export enum AlarmOccurence {
    once = 'once',
    daily = 'daily',
    weekly = 'weekly',
    monthly = 'monthly'
};

export type AlarmConfig = {
    name: string;
    occurrence: AlarmOccurence;
    time: string;
    channel: string;
    role: string;
    message: string;
}

export type GuildData = {
    serverTimezone: string;
    alarms: AlarmConfig[],
}