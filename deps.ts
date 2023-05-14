/**
 * This file re-exports external dependencies used by the partic11e repo-svc.
 *
 * @copyright 2022 integer11. All rights reserved. MIT license.
 */

//  For formatting console output
export * as colors from "std/fmt/colors.ts";

//  For parsing command line arguments
export { parse } from "std/flags/mod.ts";

//  For checking if a file exists
export { exists } from "std/fs/exists.ts";
