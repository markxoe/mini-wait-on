import process from "node:process";

import { Provider } from "./providers";
import { isNumberOr } from "./utils/number";
import { parseArgv } from "./utils/argvparser";
import { colors } from "./utils/terminalcolors";
import { HTTPsProvider } from "./providers/https";

const args = process.argv.slice(2, process.argv.length);

const run = async () => {
  // If help is wanted
  if (args.includes("--help") || args.includes("-h")) {
    console.log(
      `
Usage: ${colors.red("mini-wait-on")} ${colors.yellow(
        "resources"
      )} ${colors.blue("options")}

Examples:
  mini-wait-on file://./dist/index.js -t 5 && echo "Success"
  mini-wait-on http://localhost:3000/ https://github.com/ && npm run open-browser

Resources:
  ${colors.yellow(
    "file://"
  )} - Waiting for an file to exist. Can be relative (file://./dist/index.js) or absolute (file:///Users/testfile)
  ${colors.yellow("http://")} - Waiting for an 200 OK status code
  ${colors.yellow("https://")} - Same as http:// but with https

Options:
  ${colors.blue(
    "-t {s}"
  )} - Timeout in seconds for all resources. Exit as failure (default: Infinity)
  ${colors.blue(
    "-hd {ms}"
  )} - HTTP(s) request delay in milliseconds (default: 1000)
  ${colors.blue("-v")} - Verbose, prints some interesting stuff
  ${colors.blue(
    "-q"
  )} - Quiet, run mini-wait-on silently (higher priority than verbose)
        `
    );
    process.exit(1);
  }

  // If not, parse arguments
  const parsed = parseArgv(args);
  const quiet = parsed.flags.includes("-q");
  const verbose = parsed.flags.includes("-v");
  const timeout = isNumberOr(parsed.options["-t"], Infinity);

  // If there are no providers, skip
  if (parsed.providers.length == 0) {
    if (!quiet) console.log("No resources, exit with code 0");
    process.exit(0);
  }

  // Else print out what to wait for
  if (!quiet)
    console.log(
      `Waiting for ${parsed.providers.length} resource${
        parsed.providers.length == 1 ? "" : "s"
      }\n\t${parsed.providers.map((i) => i.printableString()).join("\n\t")}`
    );

  applyProviderOptions(parsed.providers, { httpsDelay: parsed.options["-hd"] });

  // And wait for those providers
  awaitAllProviders(parsed.providers, {
    timeout,
    verbose,
    quiet,
  });
};

const applyProviderOptions = (
  providers: Provider[],
  { httpsDelay }: { httpsDelay?: number }
) => {
  providers.forEach((provider) => {
    if (provider instanceof HTTPsProvider)
      if (httpsDelay !== undefined) provider.runner.setDelay(httpsDelay);
  });
};

const awaitAllProviders = (
  providers: Provider[],
  {
    timeout,
    verbose,
    quiet,
  }: { timeout: number; verbose: boolean; quiet: boolean }
) => {
  let timeoutTimerID: NodeJS.Timer; // Here is the timeout timer stored (if timeout enabled)

  if (timeout !== Infinity) {
    // If the timeout is not infinite, create an timeout timer
    timeoutTimerID = setTimeout(() => {
      // Which prints out some info
      if (!quiet) {
        console.log();
        console.log("Timout reached");
        const notDoneLength = providers.filter(
          (i) => !i.runner.isDone()
        ).length;
        console.log(
          `${notDoneLength} resource${notDoneLength == 1 ? "" : "s"} not done`
        );
      }
      // And exits with code 1
      process.exit(1);
    }, timeout * 1000);
  }

  // This is what to run if any runner is done with its job
  const onRunnerDone = (provider: Provider) => () => {
    if (verbose && !quiet) console.log(provider.printableString(), "is Done");

    // If all runners are done, clear the timeout timer and exit with code 0
    if (providers.every((provider) => provider.runner.isDone())) {
      if (timeoutTimerID) clearTimeout(timeoutTimerID);

      process.exit(0);
    }
  };

  // Register the onRunnerDone event listeners
  providers.forEach((provider) =>
    provider.runner.on("done", onRunnerDone(provider))
  );
  // and start all providers
  providers.forEach((provider) => provider.runner.start());
};

run();
