import { createTemplate } from "../create_template.ts";
import type { PackageProps, PackagePropsPath } from "../types/mod.ts";

export const depsTs = createTemplate<PackagePropsPath, PackageProps>`/**
 * This file re-exports external dependencies used by the partic11e ${"pkg.name"}.
 *
 * @copyright 2022 integer11. All rights reserved. MIT license.
 */

//  Export base exception features.
export { Exception } from "p11/exceptions/mod.ts";
export type { TExceptionInit } from "p11/exceptions/mod.ts";
`;
