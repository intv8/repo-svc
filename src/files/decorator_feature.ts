import { createTemplate } from "../create_template.ts";
import type { FeatureProps, FeaturePropsPath } from "../types/mod.ts";

export const decoratorFeature = createTemplate<FeaturePropsPath, FeatureProps>
  `/**
 * ${"feature.description"}
 *
 * TODO: Implement ${"feature.name"} decorator and update documentation.
 */
export function ${"feature.name"}() {
  //  TODO: Implement ${"feature.name"} feature.
}
`;
