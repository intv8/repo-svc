import { createTemplate } from "../create_template.ts";
import type { PackageProps, PackagePropsPath } from "../types/mod.ts";

export const srcTypesEnumsTs = createTemplate<
  PackagePropsPath,
  PackageProps
>`/**
 * This file exports enums used by the the kz.io ${"pkg.name"} package
 * and its peer and dependant packages.
 *
 * @copyright 2022 integereleven. All rights reserved. MIT license.
 */
`;
