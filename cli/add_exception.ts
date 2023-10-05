/**
 * This file contains the add exception cli task.
 *
 * @copyright 2022 integereleven. All rights reserved. MIT license.
 */

//  Import the addExceptionTask function and parseArgs function
import { addExceptionTask, parseArgs } from "../mod.ts";

/**
 * This function is the entry point for the add exception cli task.
 *
 * @param args The command line arguments
 */
function addExceptionCliTask(args: string[]): void {
  //  Parse the command line arguments
  const { testing, logLevel } = parseArgs(args);

  //  Call the addExceptionTask function
  addExceptionTask(testing, logLevel);
}

//  Call the addExceptionCliTask function
addExceptionCliTask(Deno.args);
