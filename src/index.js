/* eslint-disable */
require("@babel/register")({
  extensions: [".js", ".ts"]
});
console.log({ __dirname, __filename });
require("./cli.ts");
