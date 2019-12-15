import commander from "commander";

import { start } from "./index";

commander
  .version("0.0.1")
  .option("-")
  .parse(process.argv);

start("/mnt/c/Users/felip/Github/fforres")
  .then(() => {
    process.exit(0);
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
