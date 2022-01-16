import fs from "fs";
import path from "path";
import { FileProvider } from "../src/providers/file";
import { getProvider } from "../src/providers/get";
import { HTTPsProvider } from "../src/providers/https";
import { awaitTimeout, TestHTTPServer, TestHTTPSServer } from "./utils";

const dir = path.join(__dirname, "temp");

describe("File provider", () => {
  beforeEach(() => {
    if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true });
    fs.mkdirSync(dir);
  });

  test("Create File ends in success", async () => {
    const filepath = path.join(dir, "test");
    const provider = new FileProvider("file://" + filepath);
    provider.runner.start();

    expect(provider.runner.isDone()).toBe(false);

    fs.writeFileSync(filepath, "");

    await awaitTimeout(150);
    expect(provider.runner.isDone()).toBe(true);
  });

  test("Not creating file ends in failure", async () => {
    const filepath = path.join(dir, "test");
    const provider = new FileProvider("file://" + filepath);
    provider.runner.start();
    await awaitTimeout(150);

    expect(provider.runner.isDone()).toBe(false);

    provider.runner.softBreak();
  });

  test("Printable string", async () => {
    const filepath = path.join(dir, "test");
    const provider = new FileProvider("file://" + filepath);

    expect(provider.printableString()).toContain(filepath);
  });

  test("onDone event listener", async () => {
    const filepath = path.join(dir, "test");
    const provider = new FileProvider("file://" + filepath);

    const onDone = jest.fn();

    provider.runner.on("done", onDone);
    provider.runner.start();

    fs.writeFileSync(filepath, "");

    await awaitTimeout(150);

    expect(onDone).toHaveBeenCalledTimes(1);
  });
});

describe("Get providers", () => {
  test("Get providers", () => {
    expect(getProvider("file://./temp/test")).toBeInstanceOf(FileProvider);
    expect(getProvider("http://github.com/")).toBeInstanceOf(HTTPsProvider);
    expect(getProvider("https://github.com/")).toBeInstanceOf(HTTPsProvider);
  });
  test("Get none returns undefined", () => {
    expect(getProvider("")).toBe(undefined);
  });
});

describe("HTTP provider", () => {
  test("HTTP", async () => {
    const server = new TestHTTPServer(8080);
    server.responseCode = 200;
    const provider = new HTTPsProvider("http://localhost:8080");
    provider.runner.setDelay(100);
    provider.runner.start();

    await awaitTimeout(150);
    expect(provider.runner.isDone()).toBeFalsy();

    server.start();
    await awaitTimeout(150);

    expect(provider.runner.isDone()).toBeTruthy();

    server.end();
  });

  test("HTTPS", async () => {
    const server = new TestHTTPSServer(8081);
    server.responseCode = 200;

    const provider = new HTTPsProvider("https://localhost:8081");
    provider.runner.setDelay(100);
    provider.runner.start();

    await awaitTimeout(150);
    expect(provider.runner.isDone()).toBeFalsy();

    server.start();
    await awaitTimeout(150);

    expect(provider.runner.isDone()).toBeTruthy();

    server.end();
  });

  test("Printable string HTTP", async () => {
    const url = "http://localhost:3000/";
    const provider = new HTTPsProvider(url);

    expect(provider.printableString()).toContain(url);
  });

  test("Printable string HTTPs", async () => {
    const url = "https://localhost:3000/";
    const provider = new HTTPsProvider(url);

    expect(provider.printableString()).toContain(url);
  });
});
