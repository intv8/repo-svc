import { createTemplate } from "../create_template.ts";
import type { PackageProps, PackagePropsPath } from "../types/mod.ts";

export const srcConstants = createTemplate<PackagePropsPath, PackageProps>`/**
 * This file exports constants used by the intv8 ${"pkg.name"} package and 
 * its peer and dependant packages.
 *
 * @copyright 2022 integereleven. All rights reserved. MIT license.
 */
`;
