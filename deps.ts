/**
 * This file re-exports external dependencies used by the partic11e repo-svc.
 *
 * @copyright 2022 integer11. All rights reserved. MIT license.
 */

//  For formatting console output
export * as colors from "https://deno.land/std@0.185.0/fmt/colors.ts";

//  For parsing command line arguments
export { parse } from "https://deno.land/std@0.185.0/flags/mod.ts";

//  For checking if a file exists
export { exists } from "https://deno.land/std@0.185.0/fs/exists.ts";
