import { createTemplate } from "../create_template.ts";
import type { PackageProps, PackagePropsPath } from "../types/mod.ts";

export const srcVersionTs = createTemplate<PackagePropsPath, PackageProps>`/**
 * This file exports the current release version of the partic11e ${"pkg.name"}
 * pkg.
 *
 * @copyright 2022 integer11. All rights reserved. MIT license.
 */

/**
 * The current release version of the partic11e ${"pkg.name"} pkg.
 */
export const VERSION = "${"pkg.version"}";
`;
