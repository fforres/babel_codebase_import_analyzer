#!/usr/bin/env node
const argv = require("yargs").argv;
const { start } = require("./src");

console.log({ argv });
const { path } = argv;
if (!path) {
  console.error('please add --path="" option');
  process.exit(1);
}

start(path).catch(e => console.error(e));
