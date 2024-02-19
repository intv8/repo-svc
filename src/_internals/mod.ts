/**
 * This file exports features internal to the kz.io repo-svc package.
 * Features exported here should not be exposed to the public API.
 *
 * @copyright 2022 integereleven. All rights reserved. MIT license.
 */

export {
  denoConfigExists,
  readDenoConfig,
  writeDenoConfig,
} from "./deno_config.ts";

export { getRepoDetails } from "./get_repo_details.ts";
