/**
 * This file contains the initialize repo cli task.
 *
 * @copyright 2022 integer11. All rights reserved. MIT license.
 */

//  Import the initRepoTask function and parseArgs function
import { initRepoTask, parseArgs } from "../mod.ts";

/**
 * This function is the entry point for the initialize repo cli task.
 *
 * @param args The command line arguments
 */
function initRepoCliTask(args: string[]): void {
  //  Parse the command line arguments
  const { testing, logLevel } = parseArgs(args);

  //  Call the initRepoTask function
  initRepoTask(testing, logLevel);
}

//  Call the initRepoCliTask function
initRepoCliTask(Deno.args);
