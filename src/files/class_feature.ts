import { createTemplate } from "../create_template.ts";
import type { FeatureProps, FeaturePropsPath } from "../types/mod.ts";

export const classFeature = createTemplate<FeaturePropsPath, FeatureProps>`/**
 * ${"feature.description"}
 *
 * TODO: Implement ${"feature.name"} class and update documentation.
 */
export class ${"feature.name"} {
  /**
   * Instantiates a new ${"feature.name"}.
   * 
   * TODO: Implement ${"feature.name"} constructor and update documentation.
   */
  constructor() {
    //  TODO: Implement ${"feature.name"} feature.
  }
}
`;
