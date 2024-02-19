import { createTemplate } from "../create_template.ts";
import type { PackageProps, PackagePropsPath } from "../types/mod.ts";

export const srcTypesModTs = createTemplate<PackagePropsPath, PackageProps>`/**
 * This file exports types used by the the intv8 ${"pkg.name"} package
 * and its peer and dependant packages.
 * 
 * @copyright 2022 integereleven. All rights reserved. MIT license.
 */

export { /* ExplicitExport */ } from "./enums.ts";
export { /* ExplicitExport */ } from "./interfaces.ts";
export { /* ExplicitExport */ } from "./types.ts";
`;
