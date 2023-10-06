import { createTemplate } from "../create_template.ts";
import type { PackageProps, PackagePropsPath } from "../types/mod.ts";

export const devDepsTs = createTemplate<PackagePropsPath, PackageProps>`/**
 * This file re-exports external development dependencies used by the intv8
 * ${"pkg.name"} package.
 *
 * @copyright 2022 integereleven. All rights reserved. MIT license.
 */

export {
  describe,
  it,
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
} from "std/testing/bdd.ts";

export {
  assert,
  unimplemented,
} from "std/testing/asserts.ts";
`;
