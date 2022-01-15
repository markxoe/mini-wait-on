import http from "node:http";
import https from "node:https";
import { Provider } from ".";
import { AsyncRunner } from "../runners/async";

// This provider waits for an 200 OK response
export class HTTPsProvider extends Provider {
  private isSecure: boolean;

  constructor(input: string, options?: { delay?: number }) {
    super(input);
    this.isSecure = input.startsWith("https://");
    this.runner = new AsyncRunner(() => this.tick(), options?.delay ?? 1000);
  }

  runRequest() {
    return new Promise<boolean>((resolve) => {
      const url = new URL(this.input);

      const config: Partial<http.RequestOptions> = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        timeout: 10000,
        protocol: url.protocol,
      };

      const request = this.isSecure
        ? https.request({
            ...config,
            rejectUnauthorized: false,
          })
        : http.request(config);

      const errCallback = () => {
        request.destroy();
        resolve(false);
      };

      request
        .on("error", errCallback)
        .on("timeout", errCallback)
        .once("response", (res) => {
          resolve(res.statusCode == 200);
          res.destroy();
        })
        .end();
    });
  }

  async tick() {
    return await this.runRequest();
  }

  printableString(): string {
    return `HTTP${this.isSecure ? "S" : ""}: ${this.input}`;
  }
}

export const isHTTPsProvider = (input: string) => {
  return input.startsWith("http://") || input.startsWith("https://");
};
