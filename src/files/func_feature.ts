import { createTemplate } from "../create_template.ts";
import type { FeatureProps, FeaturePropsPath } from "../types/mod.ts";

export const funcFeature = createTemplate<FeaturePropsPath, FeatureProps>`/**
 * ${"feature.description"}
 *
 * TODO: Implement ${"feature.name"} function and update documentation.
 */
export function ${"feature.name"}() {
  //  TODO: Implement ${"feature.name"} feature.
}
`;
