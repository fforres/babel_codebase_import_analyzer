/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
const babel = require("@babel/core");
const glob = require("glob");
// eslint-disable-next-line import/no-extraneous-dependencies
const { resolve } = require("path");
const { existsSync } = require("fs");
const { readFile, writeFile, mkdir } = require("fs").promises;
const pMap = require("p-map");

const mapOfImportsByFiles = {};
const mapOfImportsByImportSources = {};

const getFilesToProcess = path => {
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

const getFileContent = async file => {
  const fileContent = await readFile(file);
  return fileContent.toString();
};

const hasImportDeclaration = node => node.type === "ImportDeclaration";

const getDefaultImportInformation = node => {
  const defaultImport = node.specifiers.find(
    ({ type }) => type === "ImportDefaultSpecifier"
  );
  if (defaultImport) {
    return {
      hasDefaultImport: true,
      defaultImportName: defaultImport.local.name
    };
  }
  return {
    hasDefaultImport: false,
    defaultImportName: ""
  };
};

const getNamedImportsInformation = node => {
  const namedImportsNames = node.specifiers
    .filter(specifier => specifier.type === "ImportSpecifier")
    .map(specifier => {
      if (specifier.local.type !== "Identifier") {
        return null;
      }
      return specifier.local.name;
    })
    .filter(importName => Boolean(importName));
  return {
    hasNamedImports: namedImportsNames.length > 0,
    namedImportsNames
  };
};

const pushToMap = (object, key, value) => {
  if (!object[key]) {
    object[key] = []; // eslint-disable-line no-param-reassign
  }
  object[key].push(value); // eslint-disable-line no-param-reassign
};

const getImportInformation = (node, filename) => {
  if (!hasImportDeclaration(node)) {
    return null;
  }
  const { hasNamedImports, namedImportsNames } = getNamedImportsInformation(
    node
  );
  const { hasDefaultImport, defaultImportName } = getDefaultImportInformation(
    node
  );

  const source = node.source.value;
  const result = {
    source,
    filename,
    hasNamedImports,
    hasDefaultImport,
    namedImportsNames,
    defaultImportName,
    datadogTags: [
      `has-named-imports:${hasNamedImports}`,
      `has-default-import:${hasDefaultImport}`,
      `file-name:${filename}`,
      `import-source:${source}`,
      ...namedImportsNames.map(
        namedImportsName => `named-imports-names:${namedImportsName}`
      ),
      `default-import-name:${defaultImportName}`
    ]
  };
  pushToMap(mapOfImportsByImportSources, source, result);
  return result;
};

const flat = arr => arr.reduce((acc, val) => acc.concat(val), []); // [1, 2, 3, 4]

const saveToFile = async (file, filename) => {
  const folderPath = resolve(__dirname, "db");
  if (!existsSync(folderPath)) {
    await mkdir(folderPath);
  }
  await writeFile(
    resolve(__dirname, "db", filename),
    JSON.stringify(file, null, 2)
  );
};

const start = async pathToCheck => {
  const files = getFilesToProcess(pathToCheck);
  if (!files.length) {
    console.error(`No files to process`);
    return;
  }
  // console.log(`Looking to process processing ${files.length} files`);
  console.time(`time processing ${files.length} files`);
  const arrayOfImportInformation = await pMap(
    files,
    async filename => {
      console.time(`time processing ${filename}`);
      const fileContent = await getFileContent(filename);
      const ast = await babel.parseAsync(fileContent, {
        filename,
        ast: true
      });
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
  const flatten = flat(arrayOfImportInformation);
  await saveToFile(files, "processedFiles.json");
  await saveToFile(flatten, "arrayOfImportInformation.json");
  await saveToFile(mapOfImportsByFiles, "mapOfImportsByFiles.json");
  await saveToFile(
    mapOfImportsByImportSources,
    "mapOfImportsByImportSources.json"
  );
};

module.exports.start = start;
