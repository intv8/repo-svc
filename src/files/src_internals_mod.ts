import { createTemplate } from "../create_template.ts";
import type { PackageProps, PackagePropsPath } from "../types/mod.ts";

export const srcInternalsModTs = createTemplate<
  PackagePropsPath,
  PackageProps
>`/**
 * This file exports features internal to the partic11e ${"pkg.name"} package.
 * Features exported here should not be exposed to the public API.
 *
 * @copyright 2022 integer11. All rights reserved. MIT license.
 */

//  Export internal constants
export * from "./constants.ts";
`;
