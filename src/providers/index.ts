import { Runner } from "../runners/index";

// This is the abstact class for the Providers
// An provider provides some kinda service to wait for an resource

export abstract class Provider<R extends Runner = Runner> {
  protected input: string;
  public runner: R;

  constructor(input: string) {
    this.input = input;
  }

  abstract tick(): boolean | Promise<boolean>;

  abstract printableString(): string;
}
