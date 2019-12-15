import { resolve } from "path";
import glob from "globby";
import { existsSync } from "fs";
import { promises } from "fs";
import minimatch from "minimatch";
import { SettingsType } from "./settings";
const { readFile, writeFile, mkdir } = promises;

export const saveToFile = async (file: string, filename: string) => {
  const folderPath = resolve(__dirname, "db");
  if (!existsSync(folderPath)) {
    await mkdir(folderPath);
  }
  await writeFile(
    resolve(__dirname, "db", filename),
    JSON.stringify(file, null, 2)
  );
};

export const getFileContent = async (file: string) => {
  const fileContent = await readFile(file);
  return fileContent.toString();
};

export const getFilesToProcess = async (
  path: string,
  settings: SettingsType
) => {
  const allFiles = await glob(path, {
    expandDirectories: true
  });
  // Filter allowed extensions

  const allowedPatterns = settings.allowPatterns.map(
    pattern => `**/${pattern}`
  );
  const filesFilteredByAllowedExtension = allFiles.filter(file => {
    return allowedPatterns.some(allowedPattern => {
      return minimatch(file, allowedPattern);
    });
  });

  const ignorePatterns = settings.ignorePatterns.map(
    pattern => `**/${pattern}`
  );
  const filesFilteredByIgnorePatterns = filesFilteredByAllowedExtension.filter(
    file => {
      return !ignorePatterns.some(ignorePattern => {
        return minimatch(file, ignorePattern);
      });
    }
  );

  return filesFilteredByIgnorePatterns;
};
