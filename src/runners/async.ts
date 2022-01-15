import { PayloadFN, Runner } from ".";

// This runner awaits the payload, waits for some delay and then does this until the payload returns true
export class AsyncRunner extends Runner {
  private delay: number;
  constructor(payload: PayloadFN, delay: number) {
    super(payload);
    this.delay = delay;
  }

  start() {
    new Promise(async () => {
      while (!this.isDone()) {
        const res = await this.payload();
        if (res === true) this.setDone();
        else await this.asyncDelay(this.delay);
      }
    });
  }

  private async asyncDelay(delay: number) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(undefined), delay);
    });
  }
}
