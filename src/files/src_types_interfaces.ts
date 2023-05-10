import { createTemplate } from "../create_template.ts";
import type { PackageProps, PackagePropsPath } from "../types/mod.ts";

export const srcTypesInterfacesTs = createTemplate<
  PackagePropsPath,
  PackageProps
>`/**
 * This file exports interfaces used by the the partic11e ${"pkg.name"} pkg
 * and its peer and dependant pkgs.
 *
 * For type aliases, see ./types.ts.
 *
 * @copyright 2022 integer11. All rights reserved. MIT license.
 */
`;
