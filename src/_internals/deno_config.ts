/**
 * This file exports functions for reading and writing the deno config file (`deno.jsonc`).
 *
 * @copyright 2022 integer11. All rights reserved. MIT license.
 */

//  For checking if a file exists
import { exists } from "../../deps.ts";

/**
 * Checks if the deno config (`deno.jsonc`) file exists.
 *
 * @param rootDir The root directory of the repo.
 * @returns True if the deno config file exists, false otherwise.
 */
export async function denoConfigExists(rootDir: string): Promise<boolean> {
  //  Return whether the deno config file exists
  return await exists(`${rootDir}/deno.jsonc`);
}

/**
 * Reads the deno config file (`deno.jsonc`).
 *
 * @param rootDir The root directory of the repo.
 * @returns The deno config object.
 */
// deno-lint-ignore no-explicit-any
export async function readDenoConfig(rootDir: string): Promise<any> {
  //  If the deno config file does not exist, return an empty object
  if (!(await exists(`${rootDir}/deno.jsonc`))) return {};

  //  Read the deno config file
  const denoConfig = await Deno.readTextFile(`${rootDir}/deno.jsonc`);

  //  Return the parsed deno config
  return JSON.parse(denoConfig);
}

/**
 * Writes the deno config file (`deno.jsonc`).
 *
 * @param rootDir The root directory of the repo.
 * @param config The deno config object.
 */
export async function writeDenoConfig(
  rootDir: string,
  config: unknown,
): Promise<void> {
  //  Stringify the deno config
  const denoConfig = JSON.stringify(config, null, 2);

  //  Write the deno config file
  await Deno.writeTextFile(`${rootDir}/deno.jsonc`, denoConfig);
}
