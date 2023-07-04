import { createTemplate } from "../create_template.ts";
import type { PackageProps, PackagePropsPath } from "../types/mod.ts";

export const srcConstants = createTemplate<PackagePropsPath, PackageProps>`/**
 * This file exports constants used by the partic11e ${"pkg.name"} package and 
 * its peer and dependant packages.
 *
 * @copyright 2022 integer11. All rights reserved. MIT license.
 */
`;
