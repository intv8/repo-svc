/**
 * This file contains the commit cli task.
 *
 * @copyright 2022 integereleven. All rights reserved. MIT license.
 */

//  Import the commit function and parseArgs function
import { commitTask, parseArgs } from "../mod.ts";

/**
 * This function is the entry point for the commit cli task.
 *
 * @param args The command line arguments
 */
function commitCliTask(args: string[]): void {
  //  Parse the command line arguments
  const { testing, logLevel } = parseArgs(args);

  //  Call the commitTask function
  commitTask(testing, logLevel);
}

//  Call the commitCliTask function
commitCliTask(Deno.args);
