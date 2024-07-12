// see types of prompts:
// https://github.com/enquirer/enquirer/tree/master/examples
//
module.exports = [
  {
    type: "input",
    name: "path",
    initial: "src",
    message: "Path (e.g., 'commands' or 'src'):",
    onSubmit: (name, value, input) => {
      // Remove leading './' and trailing '/'
      value = value.replace(/^\.\//, "").replace(/\/$/, "");
      input.state.answers.path = value;
    },
  },
  {
    type: "input",
    name: "commandBinImportPathInput",
    initial: "../src/index.js",
    message:
      "Command import path (usually '../commands/index.js' or  '../src/index.js'):",
    onSubmit: (name, value, input) => {
      input.state.answers.importPath = value;
    },
  },
  {
    type: "input",
    name: "name",
    initial: "index",
    message: "File name (usually 'index'):",
  },
  {
    type: "input",
    name: "commandBinPathInput",
    initial: "bin/command.js",
    message: "Command file (usually 'bin/command.js'):",
    onSubmit: (name, value, input) => {
      input.state.answers.commandPath = value;
    },
  },
  {
    type: "input",
    name: "subtypeInput",
    initial: "",
    message: "Subtype (usually empty ''):",
    onSubmit: (name, value, input) => {
      input.state.answers.subtype = value;
      input.state.answers.dotSubtype = value ? `.${value}` : "";
    },
  },
  {
    type: "input",
    name: "subspecInput",
    message:
      "Sub-spec test, for `npm run test:spec:SUBSPEC:sum.function` command (usually empty ''):",
    onSubmit: (name, value, input) => {
      input.state.answers.subspec = value;
      input.state.answers.colonSubspec = value ? `:${value}` : "";
    },
  },
];
