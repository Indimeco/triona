export type ConfigSchema = {
  dataPath: string;
  prefix: string;
};

export const config: ConfigSchema = {
  dataPath: 'data',
  prefix: '~',
};
