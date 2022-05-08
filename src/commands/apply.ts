import { Arguments, CommandBuilder } from "yargs";

import { authenticate, BaseOptions, baseOptions, printError } from "../shared";
import spinner from "../services/spinner/index";
import { readFileSync } from "fs";
import yaml from "yaml";
import handlers from "./apply/handlers/handlers";

export interface Options extends BaseOptions {
  config?: string;
}

export const command = "apply [command]";
export const desc = "Executes changes to the observability configs";

export const builder: CommandBuilder<Options, Options> = (yargs) => {
  return yargs
    .options({
      ...baseOptions,
      config: {
        type: "string",
        desc: "config file",
        alias: "c",
        default: ".baselime.yml",
      },
    })
    .commandDir("apply")
    .example([
      ["$0 apply"],
      ["$0 apply --config .baselime.yml --profile prod"],
    ])
    .fail((_, err, yargs) => {
      printError(err, yargs);
    });
};

export async function handler(argv: Arguments<Options>) {
  const { config, profile } = argv;
  spinner.init(!!argv.quiet);

  await authenticate(profile!);

  const file = readFileSync(config!).toString();
  const { version, application } = yaml.parse(file);

  await handlers.apply(file, application, version);
}

