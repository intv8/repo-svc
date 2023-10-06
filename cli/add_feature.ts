/**
 * This file contains the add feature cli task.
 *
 * @copyright 2022 integereleven. All rights reserved. MIT license.
 */

//  Import the addFeatureTask function and parseArgs function
import { addFeatureTask, parseArgs } from "../mod.ts";

/**
 * This function is the entry point for the add feature cli task.
 *
 * @param args The command line arguments
 */
function addFeatureCliTask(args: string[]): void {
  //  Parse the command line arguments
  const { testing, logLevel } = parseArgs(args);

  //  Call the addFeatureTask function
  addFeatureTask(testing, logLevel);
}

//  Call the addFeatureTask function
addFeatureCliTask(Deno.args);
