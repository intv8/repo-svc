import { createTemplate } from "../create_template.ts";
import { createFilename } from "../create_filename.ts";
import type { ExceptionProps, ExceptionPropsPath } from "../types/mod.ts";

export const srcExceptionsModTsEntry = createTemplate<
  ExceptionPropsPath,
  ExceptionProps
>`
export * from "./${({ feature }) => createFilename(feature.name)}.ts";
`;
