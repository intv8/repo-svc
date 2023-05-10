import { createTemplate } from "../create_template.ts";
import type { PackageProps, PackagePropsPath } from "../types/mod.ts";

export const rootModTs = createTemplate<PackagePropsPath, PackageProps>`/**
 * This file re-exports the source-level, or public API, features of the partic11e
 * ${"pkg.name"} pkg.
 *
 * @copyright 2022 integer11. All rights reserved. MIT license.
 */

//  Re-export public API from src/mod.ts;
export * from "./src/mod.ts";
`;
