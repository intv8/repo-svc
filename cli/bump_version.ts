/**
 * This file contains the bump version cli task.
 *
 * @copyright 2022 integereleven. All rights reserved. MIT license.
 */

//  Import the bumpVersionTask function and parseArgs function
import { bumpVersionTask, parseArgs } from "../mod.ts";

/**
 * This function is the entry point for the bump version cli task.
 *
 * @param args The command line arguments
 */
function bumpVersionCliTask(args: string[]): void {
  //  Parse the command line arguments
  const { testing, logLevel } = parseArgs(args);

  //  Call the bumpVersionTask function
  bumpVersionTask(testing, logLevel);
}

//  Call the bumpVersionCliTask function
bumpVersionCliTask(Deno.args);
