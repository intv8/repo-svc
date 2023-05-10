import { createTemplate } from "../create_template.ts";
import type { PackageProps, PackagePropsPath } from "../types/mod.ts";

export const srcTypesModTs = createTemplate<PackagePropsPath, PackageProps>`/**
 * This file exports types used by the the partic11e ${"pkg.name"} pkg
 * and its peer and dependant pkgs.
 * 
 * @copyright 2022 integer11. All rights reserved. MIT license.
 */

//  Export enums
export * from "./enums.ts";

//  Export interfaces
export * from "./interfaces.ts";

//  Export type aliases
export * from "./types.ts";
`;
