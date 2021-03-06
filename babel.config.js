module.exports = {
  presets: ["@babel/env", "@babel/typescript"],
  plugins: [
    "@babel/plugin-transform-runtime",
    "@babel/proposal-class-properties",
    "@babel/proposal-object-rest-spread",
    "@babel/plugin-proposal-numeric-separator",
    "@babel/plugin-proposal-optional-chaining"
  ]
};
