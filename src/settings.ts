const defaultSetting: SettingsType = {
  dir: "",
  output: "./db",
  allowPatterns: ["*.js", "*.ts", "*.tsx", "*.jsx"],
  ignorePatterns: []
};

export type SettingsType = {
  dir: string;
  output: string;
  allowPatterns: string[];
  ignorePatterns: string[];
};

export const setSettingParameter = (key, value) => {
  defaultSetting[key] = value;
  return defaultSetting;
};

export const getSettings = () => defaultSetting;
