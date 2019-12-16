# Codebase import analyzer

## Why

I wanted to structure a tool to analyze different codebases I'm currently working on. :)

We've all been there:
Tou are working in a biiig react codebase. You also have a folder for multiple 'Button' components, under `src/some-folder/components/buttons.tsx`.
One day, your team starts creating a new set of Buttons under `src/design-system/buttons/index.tsx`, your old buttons folder starts to slowly fade away into oblivion, and into the dreaded "legacy-code" folders.

So, I wanted to create a way to analyze your codebase to figure out:

- where are specific modules are still being imported.
- what things every file is importing.

The long-term idea for this:

- To track this information repeatedly (run on CI for every prod build?)
- Create data visualizations based on that data.
- Figure out usage of modules:
  - Folders still in use
  - Usage of legacy modules
  - Track advances towards module deprecation/migrations

## How

We are using ["@babel/core"](https://www.npmjs.com/package/@babel/core) that runs with the current project babel configuration to extract the AST for every file, and do some analisys in them.

## API

|         option          |                             description                             | required |  default values   |
| :---------------------: | :-----------------------------------------------------------------: | :------: | :---------------: |
|     -d, --directory     |                        Directory to analyze                         |    ✅    |       -----       |
|      -o, --output       |                    Path to output analysis file                     |    ❌    |       ./db        |
| -a, --allowedExtensions | Comma separated list of extensions to allow certain file extensions |    ❌    | .js,.ts,.tsx,.jsx |
|      -i, --ignore       |           Comma separated list of glob patterns to ignore           |    ❌    |        ''         |
