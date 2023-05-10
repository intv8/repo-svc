import { createTemplate } from "../create_template.ts";
import { createFilename } from "../create_filename.ts";
import type { ExceptionProps, ExceptionPropsPath } from "../types/mod.ts";

export const srcInternalsModTsEntry = createTemplate<
  ExceptionPropsPath,
  ExceptionProps
>`
//  Export internal feature ${"feature.name"} and related features.
export * from "./${({ feature }) => createFilename(feature.name)}.ts";
`;
