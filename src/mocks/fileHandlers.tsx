import { resolve } from "path";
import glob from "glob";
import { existsSync } from "fs";
import { promises } from "fs";
const { readFile, writeFile, mkdir } = promises;

export const saveToFile = async (file, filename) => {
  const folderPath = resolve(__dirname, "db");
  if (!existsSync(folderPath)) {
    await mkdir(folderPath);
  }
  await writeFile(
    resolve(__dirname, "db", filename),
    JSON.stringify(file, null, 2)
  );
};

export const getFileContent = async file => {
  const fileContent = await readFile(file);
  return fileContent.toString();
};

export const getFilesToProcess = path => {
  const allFiles = glob.sync(path);
  const filteredFiles = allFiles.filter(
    e =>
      // filtering can be changed here to avoid folders or files
      !e.includes("__generated__") &&
      !e.includes("reports/dist") &&
      !e.includes("dashboard/dist") &&
      !e.endsWith(".json") &&
      (e.endsWith(".tsx") ||
        e.endsWith(".jsx") ||
        e.endsWith(".ts") ||
        e.endsWith(".js"))
  );
  return filteredFiles;
};
