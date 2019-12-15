import { pushToMap } from "./utils";
import { extname, basename, dirname } from "path";

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
    file: {
      fullPath: filename,
      extension: extname(filename),
      basename: basename(filename),
      dir: dirname(filename)
    },
    hasNamedImports,
    hasDefaultImport,
    namedImportsNames,
    defaultImportName
  };
  pushToMap(mapOfImportsByImportSources, source, result);
  console.log({ result });
  return result;
};
