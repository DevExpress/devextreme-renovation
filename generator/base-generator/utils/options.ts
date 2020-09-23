import { toStringOptions } from "../types";

export function getConditionalOptions(
  options?: toStringOptions
): toStringOptions {
  return {
    members: [],
    ...options,
    keepRef: true,
  };
}
