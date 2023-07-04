import { createTemplate } from "../create_template.ts";
import type { PackageProps, PackagePropsPath } from "../types/mod.ts";

export const importMapJson = createTemplate<PackagePropsPath, PackageProps>`{
  "imports": {
    "std/": "https://deno.land/std@0.186.0/",
    "p11/": "https://denopkg.com/partic11e/"
  }
}
`;
