// Just some Unicode Terminal color stuff
const unicodeColor = (code: number) => `\u001B[${code}m`;

const rawColors = {
  black: 30,
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  magenta: 35,
  cyan: 36,
  white: 37,
};

const colors = {} as {
  [key in keyof typeof rawColors]: (c: string) => string;
};

Object.keys(rawColors).forEach(
  (key) =>
    (colors[key] = (c: string) =>
      unicodeColor(rawColors[key]) + c + unicodeColor(39))
);

export { colors };
