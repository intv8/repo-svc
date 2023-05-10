import { createTemplate } from "../create_template.ts";
import type { PackageProps, PackagePropsPath } from "../types/mod.ts";

export const devDepsTs = createTemplate<PackagePropsPath, PackageProps>`/**
 * This file re-exports external development dependencies used by the partic11e
 * ${"pkg.name"}.
 *
 * @copyright 2022 integer11. All rights reserved. MIT license.
 */

//  Used for creating and setting up the test suite for a feature
export {
  describe,
  it,
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
} from "std/testing/bdd.ts";

//  Used for testing feature conditions or error tests not yet implemented
export {
  assert,
  unimplemented,
} from "std/testing/asserts.ts";
`;
