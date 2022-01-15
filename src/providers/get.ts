import { Provider } from ".";
import { FileProvider, isFileProvider } from "./file";
import { HTTPsProvider, isHTTPsProvider } from "./https";

export const getProvider = (input: string): Provider => {
  if (isFileProvider(input)) return new FileProvider(input);
  if (isHTTPsProvider(input)) return new HTTPsProvider(input);

  return undefined;
};
