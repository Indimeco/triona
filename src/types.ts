export enum AlarmFrequency {
  once = 'once',
  daily = 'daily',
  weekly = 'weekly',
  monthly = 'monthly',
}

export type AlarmConfig = {
  name: string;
  frequency: AlarmFrequency;
  day: string;
  time: string;
  channel: string;
  role?: string;
  message?: string;
  systemFunction?: string;
};

export type GuildData = {
  serverTimezone: string;
  alarms: AlarmConfig[];
};
