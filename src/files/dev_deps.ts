import { createTemplate } from "../create_template.ts";
import type { PackageProps, PackagePropsPath } from "../types/mod.ts";

export const devDepsTs = createTemplate<PackagePropsPath, PackageProps>`/**
 * This file re-exports external development dependencies used by the kz.io
 * ${"pkg.name"} package.
 *
 * @copyright 2022 integereleven. All rights reserved. MIT license.
 */

export { describe, it } from "https://deno.land/std@0.213.0/testing/bdd.ts";

export { assert, unimplemented } from "https://deno.land/std@0.213.0/assert/mod.ts";
`;
