# mini-wait-on

4.5kB, zero-dependency CLI alternative for `wait-on` written in TypeScript

## Installation

Using npm:

```bash
npm i mini-wait-on
```

## Usage

```
Usage: mini-wait-on resources options

Examples:
  mini-wait-on file://./dist/index.js -t 5 && echo "Success"
  mini-wait-on http://localhost:3000/ https://github.com/ && npm run open-browser

Resources:
  file:// - Waiting for an file to exist. Can be relative (file://./dist/index.js) or absolute (file:///Users/testfile)
  http:// - Waiting for an 200 OK status code
  https:// - Same as http:// but with https

Options:
  -t {s} - Timeout in seconds for all resources. Exit as failure (default: Infinity)
  -hd {ms} - HTTP(s) request delay in milliseconds (default: 1000)
  -v - Verbose, prints some interesting stuff
  -q - Quiet, run mini-wait-on silently (higher priority than verbose)
```

### Examples

```bash
$ mini-wait-on file://dist/index.js -t 5 -q && echo "Success"
$ mini-wait-on http://localhost:3000/ https://github.com/ && npm run open-browser
$ mini-wait-on http://localhost:1234/ file://dist/index.js -hd 100 -q && electron dist/index.js
```

### Resources to wait for

- `file://` Wait for an file to be created
- `http(s)://` Wait for an 200 OK code to be returned by an http(s) server

### Options and flags

- `-t {s}` Timeout in seconds. Defaults to Infinity
- `-v` Displays some verbose info. Currently only when an resource is marked as done
- `-q` Lets the CLI run quietly. This has an higher priority than `-v`.
- `-hd` HTTPs request delay in milliseconds. Defaults to 1 second (This is the short pause bbetween every HTTPs request)

## Limitations

Currently, redirects of any form (3xx) do not work and will result in failure

## License

[MIT License](LICENSE)
