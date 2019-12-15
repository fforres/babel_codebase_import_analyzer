/* eslint-disable no-console */
import babel from "@babel/core";
import pMap from "p-map";
import { saveToFile, getFileContent, getFilesToProcess } from "./fileHandlers";
import { flatten, pushToMap } from "./utils";

const mapOfImportsByFiles = {};
const mapOfImportsByImportSources = {};

export const start = async pathToCheck => {
  const files = getFilesToProcess(pathToCheck);
  if (!files.length) {
    console.error("No files to process");
    return;
  }
  // console.log(`Looking to process processing ${files.length} files`);
  console.time(`time processing ${files.length} files`);
  const arrayOfImportInformation = await pMap(
    files,
    async filename => {
      console.time(`time processing ${filename}`);
      const fileContent = await getFileContent(filename);
      const ast = (await babel.parseAsync(fileContent, {
        filename,
        ast: true
      })) as any;
      console.log({ ast });
      const Nodes = ast.program.body || [];
      const importInformation = Nodes.map(node =>
        getImportInformation(node, filename)
      ).filter(importInfo => Boolean(importInfo));
      pushToMap(mapOfImportsByFiles, filename, importInformation);
      console.timeEnd(`time processing ${filename}`);
      return importInformation;
    },
    {
      concurrency: 15
    }
  );
  console.timeEnd(`time processing ${files.length} files`);
  const flatted = flatten(arrayOfImportInformation);
  await saveToFile(files, "processedFiles.json");
  await saveToFile(flatted, "arrayOfImportInformation.json");
  await saveToFile(mapOfImportsByFiles, "mapOfImportsByFiles.json");
  await saveToFile(
    mapOfImportsByImportSources,
    "mapOfImportsByImportSources.json"
  );
};
