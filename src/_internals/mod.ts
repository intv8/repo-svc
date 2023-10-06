/**
 * This file exports features internal to the intv8 repo-svc package.
 * Features exported here should not be exposed to the public API.
 *
 * @copyright 2022 integereleven. All rights reserved. MIT license.
 */

//  For reading and writing the deno config file (`deno.jsonc`).
export * from "./deno_config.ts";

//  For getting the details of the repo.
export * from "./get_repo_details.ts";
