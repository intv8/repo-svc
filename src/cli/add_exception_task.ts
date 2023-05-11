/**
 * This file exports exports the add_exception cli task.
 *
 * @copyright 2022 integer11. All rights reserved. MIT license.
 */

//  For checking Deno permissions.
import { checkPermissions } from "../check_permissions.ts";

//  For creating the exception file name from the exception name.
import { createFilename } from "../create_filename.ts";

//  For reading the deno config file.
import { denoConfigExists, readDenoConfig } from "../_internals/mod.ts";

//  For creating the exception file content.
import {
  srcExceptionsExceptionTs,
  testsFeatureTs,
  testsFixturesFixtureTs,
} from "../files/mod.ts";

//  For creating the exception mod file export content.
import { srcExceptionsModTsEntry } from "../partials/mod.ts";

//  For creating the cli.
import { Cli } from "../cli.ts";

//  For checking if a file exists.
import { exists } from "../../deps.ts";

//  The permissions required by this task.
const PERMISSIONS: Deno.PermissionDescriptor[] = [
  {
    name: "read",
    path: "./",
  },
  {
    name: "write",
    path: "./",
  },
];

/**
 * Gets and validates the exception name from the user.
 *
 * @param cli The instance of the Cli class.
 * @returns The exception name.
 */
function getExceptionName(cli: Cli): string {
  //  Get the exception name from the user
  cli.describe(
    "An exception name must be a valid class name. It must be PascalCase, contain only letters, and end with 'Exception'. (e.g. 'MyCustomException')",
  );
  const exceptionName = cli.prompt("Enter exception name");

  //  Validate the exception name and prompt the user again if it is invalid
  if (!exceptionName) {
    cli.error("Invalid exception name.");

    return getExceptionName(cli);
  }

  if (!/^[A-Z][a-zA-Z]+Exception$/.test(exceptionName)) {
    cli.error("Invalid exception name.");

    return getExceptionName(cli);
  }

  //  Return the exception name
  return exceptionName;
}

/**
 * Gets and validates the exception description from the user.
 *
 * @param cli The instance of the Cli class.
 * @returns The exception description.
 */
function getExceptionDescription(cli: Cli): string {
  //  Get the exception description from the user
  const exceptionDescription = cli.prompt("Enter exception description");

  //  Validate the exception description and prompt the user again if it is invalid
  if (!exceptionDescription) {
    cli.error("Invalid exception description.");

    return getExceptionDescription(cli);
  }

  //  Return the exception description
  return exceptionDescription;
}

/**
 * Gets and validates the exception default message from the user.
 *
 * @param cli The instance of the Cli class.
 * @returns The exception message.
 */
function getExceptionMessage(cli: Cli): string {
  //  Get the exception message from the user
  const exceptionMessage = cli.prompt("Enter exception default message");

  //  Validate the exception message and prompt the user again if it is invalid
  if (!exceptionMessage) {
    cli.error("Invalid exception message.");

    return getExceptionMessage(cli);
  }

  //  Return the exception message
  return exceptionMessage;
}

/**
 * Gets and validates the exception code from the user.
 *
 * @param cli The instance of the Cli class.
 * @returns The exception code.
 */
function getExceptionCode(cli: Cli): number {
  // Get the exception code from the user
  cli.describe("An exception code must be a valid integer.");
  const exceptionCode = cli.prompt("Enter exception code");

  //  Validate the exception code and prompt the user again if it is invalid
  if (!exceptionCode) {
    cli.error("Invalid exception code.");

    return getExceptionCode(cli);
  }

  if (!/^[0-9]+$/.test(exceptionCode)) {
    cli.error("Invalid exception code.");

    return getExceptionCode(cli);
  }

  //  Return the exception code
  return parseInt(exceptionCode, 10);
}

/**
 * This function creates a new exception in the repo and adds it to the exception mod file.
 *
 * @param testing Whether the task is being run in testing mode.
 * @param logLevel The log level to use.
 */
export async function addExceptionTask(
  testing = false,
  logLevel = 3,
): Promise<void> {
  // Get the root directory of the repo
  const root = testing ? "./repo-test" : ".";

  //  If the deno config file does not exist, throw an error
  if (!await denoConfigExists(root)) {
    throw new Error(
      "Deno config does not exist. Please initialize a project first.",
    );
  }

  //  Read the deno config file
  const config = await readDenoConfig(root);

  //  Create the cli
  const cli = new Cli("EXC", {
    logLevel: logLevel,
    rgb24Color: 0x156AFF,
    displayName: "exception scaffolding",
  });

  //  Print the cli banner
  cli.printBanner();
  cli.describe("partic11e exception tool.");

  //  Check the permissions required by this task, and exit if they are not accepted
  const permissionsAccepted = await checkPermissions(PERMISSIONS);

  if (!permissionsAccepted) {
    cli.error("Permissions denied.");

    Deno.exit(10);
  }

  //  Get the exception name, description, message, and code from the user
  const featureName = getExceptionName(cli);
  const featureDescription = getExceptionDescription(cli);
  const exceptionMessage = (getExceptionMessage(cli)).replace(/"/g, '\\"');
  const exceptionCode = getExceptionCode(cli);

  //  Create the props object for the exception file
  const props = {
    meta: {
      date: new Date().toISOString(),
      year: new Date().getFullYear().toString(),
    },
    pkg: {
      description: config.description,
      name: config.name,
      status: config.status,
      version: config.version,
    },
    feature: {
      name: featureName,
      type: "exception",
      description: featureDescription,
    },
    exception: {
      code: exceptionCode.toString(2),
      message: exceptionMessage,
    },
  };

  //  Create the exception file content and the exception mod file entry
  const content = srcExceptionsExceptionTs(props);
  const modEntry = srcExceptionsModTsEntry(props);

  //  Create the exception file name and path
  const fileName = createFilename(featureName);
  const filePath = `${root}/src/exceptions/${fileName}.ts`;
  const modPath = `${root}/src/exceptions/mod.ts`;

  const testContent = testsFeatureTs(props);
  const testFixtureContent = testsFixturesFixtureTs(props);

  //  Check if the exception file already exists
  //  If it does, prompt the user to overwrite it
  //  If they do not want to overwrite it, exit
  if (await exists(filePath)) {
    cli.warn(`Exception ${featureName} already exists.`);

    const overwrite = cli.promptYesNo("Overwrite? (y/n)");

    if (!overwrite) {
      cli.error("Exception not created.");

      Deno.exit(12);
    }
  }

  //  Write the exception file and add the exception to the exception mod file
  cli.debug(`Writing exception to ${filePath}`);
  await Deno.writeTextFile(filePath, content);

  cli.debug(`Adding exception to exception mod file: ${modPath}`);
  await Deno.writeTextFile(modPath, modEntry, { append: true });

  //  Write test fixture and test files
  cli.debug(`Writing test to ${root}/tests/${fileName}.test.ts`);
  await Deno.writeTextFile(`${root}/tests/${fileName}.test.ts`, testContent);

  cli.debug(
    `Writing test fixture to ${root}/tests/fixtures/${fileName}.fixture.ts`,
  );
  await Deno.writeTextFile(
    `${root}/tests/fixtures/${fileName}.fixture.ts`,
    testFixtureContent,
  );

  //  Print the success message
  cli.done(`Exception ${featureName} created at ${filePath}.`);
  cli.describe("Review generated exception and resolve any TODOs.");
}
