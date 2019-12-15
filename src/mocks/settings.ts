import { constants, promises } from "fs";
import { checkAndCreatePath } from "./fileHandlers";

const { access } = promises;

const defaultSetting: SettingsType = {
  dir: "",
  output: "./db",
  allowedFilesPatterns: ["**/*.js", "**/*.ts", "**/*.tsx", "**/*.jsx"],
  ignorePatterns: []
};

export type SettingsType = {
  dir: string;
  output: string;
  allowedFilesPatterns: string[];
  ignorePatterns: string[];
};

const setSettingParameter = (key: keyof SettingsType, value) => {
  defaultSetting[key] = value;
  return defaultSetting;
};

export const getSettings = () => defaultSetting;

export const parseFileExtensions = (allowedExtensions: string) => {
  const extensions = allowedExtensions
    .split(",")
    .map((el: string) => `**/*${el.trim()}`);
  setSettingParameter("allowedFilesPatterns", extensions);
};

export const parseIgnorePatterns = (ignorePatterns: string) => {
  const patterns = ignorePatterns.split(",");
  setSettingParameter("ignorePatterns", patterns);
};

export const parseDirectory = async (directory: string) => {
  await access(directory, constants.R_OK);
  await access(directory, constants.F_OK);
  setSettingParameter("dir", directory);
};

export const parseOutput = async (output: string) => {
  await checkAndCreatePath(output);
  setSettingParameter("output", output);
};
