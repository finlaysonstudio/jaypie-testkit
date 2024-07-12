---
to: <%= commandPath %>
---
#!/usr/bin/env node
/* eslint-disable no-console */

import { Command } from "commander";
import "dotenv/config";

// TODO: Remove when commands are added
/* eslint-disable prettier/prettier, prettier-vue/prettier */
import {
  // * Added by Hygen (move above in alphabetical order)
  // #hygen-jaypie-command-import
  // * A Hygen template references this hashtag to create new commands
} from "../src/index.js";
/* eslint-enable prettier/prettier, prettier-vue/prettier */

//
//
// Setup
//

const program = new Command();

//
//
// Commands
//

//
// env:
program
  .command("env")
  .description("print the env and exit")
  .option("-x, --execute", "display env vars", false)
  // eslint-disable-next-line no-unused-vars
  .action((options, command) => {
    if (options.execute) {
      console.log("process.env :>> ", process.env);
    } else {
      console.log(
        "process.env :>> ",
        JSON.stringify(Object.keys(process.env), null, 2),
      );
      console.log("Pass --execute to see values");
    }
    console.log("options :>> ", options);
    // console.log("command :>> ", command);
  });

// * Added by Hygen (move above in alphabetical order)
// #hygen-jaypie-command-script
// * A Hygen template references this hashtag to create new commands

//
//
// Execute
//

program.parse(process.argv);
