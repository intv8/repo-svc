import { createTemplate } from "../create_template.ts";
import type { FeatureProps, FeaturePropsPath } from "../types/mod.ts";

export const srcInternalsFeatureTs = createTemplate<
  FeaturePropsPath,
  FeatureProps
>`/**
 * This file exports the internal ${"feature.name"} ${"feature.type"} and related features.
 *
 * @copyright 2022 integereleven. All rights reserved. MIT license.
 */
`;
