import { createTemplate } from "../create_template.ts";
import type { PackageProps, PackagePropsPath } from "../types/mod.ts";

export const srcInternalsModTs = createTemplate<
  PackagePropsPath,
  PackageProps
>`/**
 * This file exports features internal to the kz.io ${"pkg.name"} package.
 * Features exported here should not be exposed to the public API.
 *
 * @copyright 2022 integereleven. All rights reserved. MIT license.
 */

export { /* ExplicitExport */ } from "./constants.ts";
`;
