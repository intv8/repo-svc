import { createTemplate } from "../create_template.ts";
import { createFilename } from "../create_filename.ts";
import type { FeatureProps, FeaturePropsPath } from "../types/mod.ts";

export const testsFeatureTs = createTemplate<FeaturePropsPath, FeatureProps>`/**
 * This file contains tests for the ${"feature.name"} feature.
 *
 * @copyright 2022 integereleven. All rights reserved. MIT license.
 */

import { describe, it, unimplemented } from "../dev_deps.ts";

import { ${"feature.name"} } from "./fixtures/${({ feature }) =>
  createFilename(feature.name)}.fixtures.ts";

describe("${"feature.name"}", () => {
 it("should have a implemented test", () => {
   unimplemented();
 });
});
`;
