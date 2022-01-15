import fs from "fs";
import http from "http";
import https from "https";
import path from "path";

export const awaitTimeout = (timeout: number) => {
  return new Promise<void>((r) => setTimeout(() => r(), timeout));
};

export class TestHTTPServer {
  private port: number;
  public responseCode: number;

  private server: http.Server;

  constructor(port: number) {
    this.port = port;
    this.server = http.createServer((req, res) => {
      res.statusCode = this.responseCode;
      res.end();
    });
  }

  start() {
    this.server.listen(this.port);
  }

  end() {
    this.server.close();
  }
}

export class TestHTTPSServer {
  private port: number;
  public responseCode: number;

  private server: http.Server;

  constructor(port: number) {
    this.port = port;
    this.server = https.createServer(
      {
        cert: fs.readFileSync(path.join(__dirname, "ssl", "cert.pem")),
        key: fs.readFileSync(path.join(__dirname, "ssl", "key.pem")),
      },
      (req, res) => {
        res.statusCode = this.responseCode;
        res.end();
      }
    );
  }

  start() {
    this.server.listen(this.port);
  }

  end() {
    this.server.close();
  }
}

export const startServerForAShortTime = (responseCode: number) => {
  http
    .createServer((req, res) => {
      res.statusCode = responseCode;
      res.end();
    })
    .listen(8080);
};
