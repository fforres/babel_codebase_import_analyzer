import { pushToMap } from "./utils";

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

export const getNamedImportsInformation = node => {
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

export const getImportInformation = (
  node,
  filename,
  mapOfImportsByImportSources
) => {
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
