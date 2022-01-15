import { PayloadFN, Runner } from ".";

// This runner runs the payload at an specific interval, nice if the payload is synchronous and doesn't block that long
export class TimeRunner extends Runner {
  private timerID: NodeJS.Timer;
  private interval: number;

  constructor(payload: PayloadFN, interval: number) {
    super(payload);
    this.interval = interval;
  }

  start(): void {
    this.timerID = setInterval(async () => {
      const result = await this.payload();

      if (result == true || this.isDone()) {
        clearInterval(this.timerID);
        this.setDone();
      }
    }, this.interval);
  }
}
