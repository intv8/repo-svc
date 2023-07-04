import { Props, TemplateCallback } from "./types/mod.ts";

// deno-lint-ignore no-explicit-any
function access(obj: any, path: string): string {
  return path.split(".").reduce((result, key) => result[key], obj);
}

export function createTemplate<P extends string, T extends Props>(
  strings: TemplateStringsArray,
  ...refs: (P | TemplateCallback<T>)[]
): TemplateCallback<T> {
  const cleanedStrings = [...strings.raw.values()];
  return (props: T) =>
    refs.reduce((result, ref) => {
      const resolved = typeof ref === "function"
        ? ref(props)
        : access(props, ref);
      const nextString = cleanedStrings.shift();

      return `${String(result)}${resolved}${nextString}`;
    }, cleanedStrings.shift() || "");
}
