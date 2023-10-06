import { createTemplate } from "../create_template.ts";
import { createFilename } from "../create_filename.ts";
import type { FeatureProps, FeaturePropsPath } from "../types/mod.ts";

export const testsFixturesFixtureTs = createTemplate<
  FeaturePropsPath,
  FeatureProps
>`/**
 * This file contains test cases, mocks, or other data for testing the
 * ${"feature.name"} feature.
 *
 * For use in ../${({ feature }) => createFilename(feature.name)}.test.ts.
 *
 * @copyright 2022 integereleven. All rights reserved. MIT license.
 */
`;
