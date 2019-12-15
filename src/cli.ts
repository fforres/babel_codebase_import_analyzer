import commander from "commander";
const program = new commander.Command();

// import { start } from "./index";

program
  .version("0.0.1")
  .requiredOption("-d, --dir", "Directory to analyze")
  .option("-o, --output", "Path for analysis output - Default: ./db")
  .option(
    "-a, --allowedExtensions",
    "Comma separated list of extensions to allow certain file extensions - Default: [.js,.jsx,.ts,.tsx]"
  )
  .option(
    "-i, --ignore",
    "Comma separated list of glob patterns to ignore - Default: []"
  );

program.parse(process.argv);

console.log(program);

// start("/mnt/c/Users/felip/Github/fforres")
//   .then(() => {
//     process.exit(0);
//   })
//   .catch(e => {
//     console.error(e);
//     process.exit(1);
//   });
