/* eslint-disable no-console */
import { parseAsync } from "@babel/core";
import { Program } from "@babel/types/lib";

import pMap from "p-map";
import { saveToFile, getFileContent, getFilesToProcess } from "./fileHandlers";
import { flatten, pushToMap } from "./utils";
import { getImportInformation } from "./dataExtraction";
import { SettingsType } from "./settings";

const informationByFile = {};
const informationByImportSource = {};

export const start = async (settings: SettingsType) => {
  const filesToProcess = await getFilesToProcess(settings.dir);
  if (!filesToProcess.length) {
    throw new Error("No files to process");
  }
  console.log(`Looking to process processing ${filesToProcess.length} files`);
  console.time(`time processing ${filesToProcess.length} files`);
  const arrayOfImportInformation = await pMap(
    filesToProcess,
    async filename => {
      console.time(`time processing ${filename}`);
      const fileContent = await getFileContent(filename);
      const parsedCode = (await parseAsync(fileContent, {
        filename,
        ast: true
      })) as { program: Program }; // Needed because babel types do not return proper types for parseAsync()
      const Nodes = parsedCode?.program?.body || [];
      const importInformation = Nodes.map(node =>
        getImportInformation(node, filename, informationByImportSource)
      ).filter(importInfo => Boolean(importInfo));
      pushToMap(informationByFile, filename, importInformation);
      console.timeEnd(`time processing ${filename}`);
      return importInformation;
    },
    {
      concurrency: 1
    }
  );
  console.timeEnd(`time processing ${filesToProcess.length} files`);
  const flatted = flatten(arrayOfImportInformation);
  await saveToFile(filesToProcess, "processedFiles.json");
  await saveToFile(flatted, "arrayOfImportInformation.json");
  await saveToFile(informationByFile, "informationByFile.json");
  await saveToFile(informationByImportSource, "informationByImportSource.json");
};
