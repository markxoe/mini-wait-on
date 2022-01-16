import process from "node:process";

import { Provider } from "../providers";
import { getProvider } from "../providers/get";

const validOptions = { "-t": "Timeout duration missing" };
const validFlags = ["-v", "-q"];

// Parse argv
export const parseArgv = (argv: string[], exitOnFailure: boolean = true) => {
  let options = { "-t": undefined };
  let providers: Provider[] = [];
  let flags: string[] = [];

  let args = argv.slice();

  // As long as args are left...
  while (args.length > 0) {
    // Get the argument,
    const arg = args.splice(0, 1)[0];

    // And if it is an option we know, we can parse its right neighbour
    // If the right neighbour doesn't exist we tell the user
    const isOption = validOptions[arg] !== undefined;
    if (isOption) {
      const parameter = args.splice(0, 1)[0];
      if (!parameter) {
        console.log(validOptions[arg]);
        /* istanbul ignore next */
        if (exitOnFailure) process.exit(1);
      } else options[arg] = parameter;
      continue;
    }

    // Or if it is an flag we know, we can save that
    const isFlag = validFlags.includes(arg);
    if (isFlag) {
      flags.push(arg);
      continue;
    }

    // And if its not an option or flag, it has to be a provider
    const provider = getProvider(arg);
    if (provider) {
      providers.push(provider);
      continue;
    }

    // But what if it isn't tho? Then we tell the user and exit:
    console.log("Unknown option " + arg);
    /* istanbul ignore next */
    if (exitOnFailure) process.exit(1);
  }

  return { options, providers, flags };
};
