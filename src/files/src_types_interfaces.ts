import { createTemplate } from "../create_template.ts";
import type { PackageProps, PackagePropsPath } from "../types/mod.ts";

export const srcTypesInterfacesTs = createTemplate<
  PackagePropsPath,
  PackageProps
>`/**
 * This file exports interfaces used by the the kz.io ${"pkg.name"} package
 * and its peer and dependant packages.
 *
 * For type aliases, see ./types.ts.
 *
 * @copyright 2022 integereleven. All rights reserved. MIT license.
 */
`;
