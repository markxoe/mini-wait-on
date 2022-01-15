import { AsyncRunner } from "../src/runners/async";
import { TimeRunner } from "../src/runners/time";
import { awaitTimeout } from "./utils";

describe("Time runner", () => {
  test("Runner is done when payload returns true", async () => {
    let isDone = false;

    const runner = new TimeRunner(() => isDone, 10);
    runner.start();

    expect(runner.isDone()).toBeFalsy();

    isDone = true;
    await awaitTimeout(20);

    expect(runner.isDone()).toBeTruthy();
  });
});

describe("Async Runner", () => {
  test("Runner is done when payload returns true", async () => {
    let isDone = false;

    const runner = new AsyncRunner(() => isDone, 10);
    runner.start();

    expect(runner.isDone()).toBeFalsy();

    isDone = true;
    await awaitTimeout(20);

    expect(runner.isDone()).toBeTruthy();
  });
});
