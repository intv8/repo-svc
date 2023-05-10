import { createTemplate } from "../create_template.ts";
import { createFilename } from "../create_filename.ts";
import type { FeatureProps, FeaturePropsPath } from "../types/mod.ts";

export const testsFeatureTs = createTemplate<FeaturePropsPath, FeatureProps>`/**
 * This file contains tests for the ${"feature.name"} feature.
 *
 * @copyright 2022 integer11. All rights reserved. MIT license.
 */

//  Import test suite and assertions
import { describe, it, unimplemented } from "../dev_deps.ts";

//  Import test cases, fixtures, stubs, and/or mocks.
import { ${"feature.name"} } from "./fixtures/${({ feature }) =>
  createFilename(feature.name)}.fixtures.ts";

//  Start test suite
describe("${"feature.name"}", () => {
 it("should have a implemented test", () => {
   unimplemented();
 });
});
`;
