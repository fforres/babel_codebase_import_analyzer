import { resolve } from "path";
import glob from "globby";
import { existsSync } from "fs";
import { promises } from "fs";
import minimatch from "minimatch";
import { SettingsType, getSettings } from "./settings";
const { readFile, writeFile, mkdir } = promises;

export const checkAndCreatePath = async folderPath => {
  if (!existsSync(folderPath)) {
    await mkdir(folderPath);
  }
};

export const saveToFile = async (data: any, filename: string) => {
  await checkAndCreatePath(resolve(__dirname, "db"));
  await writeFile(
    resolve(__dirname, "db", filename),
    JSON.stringify(data, null, 2)
  );
};

export const getFileContent = async (file: string) => {
  const fileBuffer = await readFile(file);
  const fileContent = fileBuffer.toString();
  return fileContent;
};

export const getFilesToProcess = async (
  path: string,
  settings: SettingsType = getSettings()
) => {
  const allFiles = await glob(path, {
    expandDirectories: true
  });

  // Filter allowed extensions
  const filesFilteredByAllowedExtension = allFiles.filter(file => {
    return settings.allowedFilesPatterns.some(allowedPattern => {
      return minimatch(file, allowedPattern);
    });
  });

  // Filter ignored patterns
  const filesFilteredByIgnorePatterns = filesFilteredByAllowedExtension.filter(
    file => {
      return !settings.ignorePatterns.some(ignorePattern => {
        return minimatch(file, ignorePattern);
      });
    }
  );

  return filesFilteredByIgnorePatterns;
};
