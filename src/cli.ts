import commander from "commander";
const program = new commander.Command();

// import { start } from "./index";

program
  .version("0.0.1")
  .requiredOption("-d, --dir", "Directory to analyze")
  .option("-o, --output", "Path for analysis output - Default: ./db")
  .option(
    "-a, --allow",
    "Comma separated list of glob patterns to allow - Default: [.js,.jsx,.ts,.tsx]"
  )
  .option(
    "-i, --ignore",
    "Comma separated list of glob patterns to allow - Default: []"
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
