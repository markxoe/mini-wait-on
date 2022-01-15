import { FileProvider } from "../src/providers/file";
import { HTTPsProvider } from "../src/providers/https";
import { parseArgv } from "../src/utils/argvparser";

describe("Argv parser", () => {
  test("Flags and options", () => {
    const parsed = parseArgv("-v -t 10".split(" "));
    expect(parsed.flags).toContainEqual("-v");
    expect(parsed.options).toHaveProperty("-t", "10");
  });

  test("Providers", () => {
    const parsed = parseArgv(
      "file://./temp/test http://github.com/".split(" ")
    );

    expect(parsed.providers.length).toBe(2);
    expect(parsed.providers[0]).toBeInstanceOf(FileProvider);
    expect(parsed.providers[1]).toBeInstanceOf(HTTPsProvider);
  });

  test("Everything at once", () => {
    const parsed = parseArgv(
      "-v https://github.com/markxoe -t 50 file://./temp/test file://./temp/test -t 100".split(
        " "
      )
    );

    expect(parsed.flags).toContainEqual("-v");
    expect(parsed.options).toHaveProperty("-t", "100");

    expect(parsed.providers.length).toBe(3);
    expect(parsed.providers[0]).toBeInstanceOf(HTTPsProvider);
    expect(parsed.providers[1]).toBeInstanceOf(FileProvider);
    expect(parsed.providers[2]).toBeInstanceOf(FileProvider);
  });

  test("Invalid options", () => {
    console.log = jest.fn();
    // Unknown option
    parseArgv("-o".split(" "), false);
    expect(console.log).toHaveBeenCalledWith("Unknown option -o");

    // Missing timeout duration
    parseArgv("-t".split(" "), false);
    expect(console.log).toHaveBeenCalledWith("Timeout duration missing");
  });
});
