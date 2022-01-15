export abstract class Runner {
  protected payload: PayloadFN;
  private done: boolean;

  private eventListeners: { [key in "done"]: Function[] };

  constructor(payload: PayloadFN) {
    this.payload = payload;
    this.done = false;
    this.eventListeners = { done: [] };
  }

  abstract start(): void;

  protected setDone() {
    this.done = true;
    this.eventListeners.done.forEach((i) => i());

    return this;
  }

  public on(event: "done", fn: Function) {
    this.eventListeners[event].push(fn);

    return this;
  }

  isDone() {
    return this.done;
  }

  softBreak() {
    this.setDone();
  }
}

export type PayloadFN = () => Promise<boolean> | boolean;
