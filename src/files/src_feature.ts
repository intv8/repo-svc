import { createTemplate } from "../create_template.ts";
import type { FeatureProps, FeaturePropsPath } from "../types/mod.ts";

export const srcFeatureTs = createTemplate<FeaturePropsPath, FeatureProps>`/**
 * This file exports the ${"feature.name"} ${"feature.type"} and related features.
 *
 * @copyright 2022 integer11. All rights reserved. MIT license.
 */
`;
