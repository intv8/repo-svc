import { createTemplate } from "../create_template.ts";
import type { PackageProps, PackagePropsPath } from "../types/mod.ts";

export const depsTs = createTemplate<PackagePropsPath, PackageProps>`/**
 * This file re-exports external dependencies used by the intv8 ${"pkg.name"} package.
 *
 * @copyright 2022 integereleven. All rights reserved. MIT license.
 */

export { Exception, type TExceptionInit } from "https://denopkg.com/intv8/core/mod.ts";
`;
