/**
 * This file exports features internal to the partic11e repo-svc package.
 * Features exported here should not be exposed to the public API.
 *
 * @copyright 2022 integer11. All rights reserved. MIT license.
 */

//  For reading and writing the deno config file (`deno.jsonc`).
export * from "./deno_config.ts";

//  For getting the details of the repo.
export * from "./get_repo_details.ts";
