import test from "ava";
import { getFilesToProcess } from "../fileHandlers";
import { resolve } from "path";
import { getSettings, SettingsType } from "../settings";

const defaultFolderPath = resolve(__dirname, "../mocks");
const filePathGetter = (folderPath, files) =>
  files.map(el => resolve(folderPath, el));

test("getFilesToProcess should return all files inside mocks", async t => {
  const defaultFiles = [
    "analyze.ts",
    "fileHandlers.tsx",
    "index.js",
    "index.md",
    "index.ts",
    "utils.ts"
  ];
  const files = await getFilesToProcess(defaultFolderPath, getSettings());
  const filePaths = filePathGetter(defaultFolderPath, defaultFiles);
  t.is(files.length, 6);
  t.deepEqual(filePaths, files);
});

test.only("getFilesToProcess returns only allowed extensions", async t => {
  const defaultFiles = ["fileHandlers.tsx", "index.js", "index.md"];
  const settings: SettingsType = {
    ...getSettings(),
    allowPatterns: ["*.tsx", "*.js", "*.md"]
  };
  const filePaths = filePathGetter(defaultFolderPath, defaultFiles);
  const files = await getFilesToProcess(defaultFolderPath, settings);
  t.is(files.length, 3);
  t.deepEqual(filePaths, files);
});

test("getFilesToProcess filter out ignorePatterns", async t => {
  const defaultFiles = [
    "analyze.ts",
    "fileHandlers.tsx",
    "index.ts",
    "utils.ts"
  ];
  const settings: SettingsType = {
    ...getSettings(),
    allowPatterns: ["*.*"],
    ignorePatterns: ["*.md", "*.js"]
  };
  const filePaths = filePathGetter(defaultFolderPath, defaultFiles);
  const files = await getFilesToProcess(defaultFolderPath, settings);
  t.is(files.length, 4);
  t.deepEqual(filePaths, files);
});
