import { createTemplate } from "../create_template.ts";
import { createFilename } from "../create_filename.ts";
import type { FeatureProps, FeaturePropsPath } from "../types/mod.ts";

export const srcModTsEntry = createTemplate<FeaturePropsPath, FeatureProps>`
//  Export feature ${"feature.name"} and related features.
export * from "./${({ feature }) => createFilename(feature.name)}.ts";
`;
