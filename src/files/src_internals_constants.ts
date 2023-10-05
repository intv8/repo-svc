import { createTemplate } from "../create_template.ts";
import type { PackageProps, PackagePropsPath } from "../types/mod.ts";

export const srcInternalsConstantsTs = createTemplate<
  PackagePropsPath,
  PackageProps
>`/**
 * This file exports internal constants used by the intv8 ${"pkg.name"} package.
 * Constants exported here should not be exposed to the public API.
 *
 * @copyright 2022 integereleven. All rights reserved. MIT license.
 */
`;
