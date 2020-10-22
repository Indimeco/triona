export type AlarmConfig = {
    channel: string;
    message: string;
    name: string;
    role: string;
    time: string;
}

export type GuildData = {
    serverTimezone: string;
    alarms: AlarmConfig[],
}