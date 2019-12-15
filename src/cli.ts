import commander from "commander";
import {
  parseFileExtensions,
  parseIgnorePatterns,
  parseDirectory,
  parseOutput,
  getSettings
} from "./settings";
const program = new commander.Command();

program
  .version("0.0.1")
  .usage("[options] folderPath")
  .requiredOption(
    "-d, --directory <directory to analyze>",
    "Directory to analyze"
  )
  .option("-o, --output <directory>", "Path to output analysis file", "./db")
  .option(
    "-a, --allowedExtensions <comma separated values>",
    "Comma separated list of extensions to allow certain file extensions",
    ".js,.ts,.tsx,.jsx"
  )
  .option(
    "-i, --ignore <comma separated values>",
    "Comma separated list of glob patterns to ignore",
    ""
  );

const config = async () => {
  program.parse(process.argv);
  await parseDirectory(program.directory);
  await parseOutput(program.output);
  parseFileExtensions(program.allowedExtensions);
  parseIgnorePatterns(program.ignore);
  console.log(getSettings());
};

config()
  .then(() => {
    process.exit(0);
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
