import { createTemplate } from "../create_template.ts";
import type { PackageProps, PackagePropsPath } from "../types/mod.ts";

export const srcModTs = createTemplate<PackagePropsPath, PackageProps>`/**
 * This file exports the public API features of the partic11e ${"pkg.name"} package.
 *
 * @copyright 2022 integer11. All rights reserved. MIT license.
 */

//  Export public types
export * from "./types/mod.ts";

//  Export public exceptions
export * from "./exceptions/mod.ts";

//  Export public constants
export * from "./constants.ts";

//  Export version
export * from "./version.ts";
`;
