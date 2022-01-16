import * as fs from "fs";
import { Provider } from ".";
import { TimeRunner } from "../runners/time";

// This provider waits for an file to be existing
export class FileProvider extends Provider<TimeRunner> {
  private file: string;

  constructor(input: string) {
    super(input);
    this.file = input.replace("file://", "");
    this.runner = new TimeRunner(() => this.tick(), 100);
  }

  tick() {
    return fs.existsSync(this.file);
  }

  printableString(): string {
    return this.file;
  }
}

export const isFileProvider = (input: string) => {
  return input.startsWith("file://");
};
