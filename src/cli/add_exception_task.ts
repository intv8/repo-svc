/**
 * This file exports exports the add_exception cli task.
 *
 * @copyright 2022 integereleven. All rights reserved. MIT license.
 */

import { checkPermissions } from "../check_permissions.ts";
import { createFilename } from "../create_filename.ts";
import { denoConfigExists, readDenoConfig } from "../_internals/mod.ts";
import { srcExceptionsModTsEntry } from "../partials/mod.ts";
import { Cli } from "../cli.ts";
import { exists } from "../../deps.ts";

import {
  srcExceptionsExceptionTs,
  testsFeatureTs,
  testsFixturesFixtureTs,
} from "../files/mod.ts";

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
  cli.describe(
    "An exception name must be a valid class name. It must be PascalCase, contain only letters, and end with 'Exception'. (e.g. 'MyCustomException')",
  );
  const exceptionName = cli.prompt("Enter exception name");

  if (!exceptionName) {
    cli.error("Invalid exception name.");

    return getExceptionName(cli);
  }

  if (!/^[A-Z][a-zA-Z]+Exception$/.test(exceptionName)) {
    cli.error("Invalid exception name.");

    return getExceptionName(cli);
  }

  return exceptionName;
}

/**
 * Gets and validates the exception description from the user.
 *
 * @param cli The instance of the Cli class.
 * @returns The exception description.
 */
function getExceptionDescription(cli: Cli): string {
  const exceptionDescription = cli.prompt("Enter exception description");

  if (!exceptionDescription) {
    cli.error("Invalid exception description.");

    return getExceptionDescription(cli);
  }

  return exceptionDescription;
}

/**
 * Gets and validates the exception default message from the user.
 *
 * @param cli The instance of the Cli class.
 * @returns The exception message.
 */
function getExceptionMessage(cli: Cli): string {
  const exceptionMessage = cli.prompt("Enter exception default message");

  if (!exceptionMessage) {
    cli.error("Invalid exception message.");

    return getExceptionMessage(cli);
  }

  return exceptionMessage;
}

/**
 * Gets and validates the exception code from the user.
 *
 * @param cli The instance of the Cli class.
 * @returns The exception code.
 */
function getExceptionCode(cli: Cli): number {
  cli.describe("An exception code must be a valid integer.");
  const exceptionCode = cli.prompt("Enter exception code");

  if (!exceptionCode) {
    cli.error("Invalid exception code.");

    return getExceptionCode(cli);
  }

  if (!/^[0-9]+$/.test(exceptionCode)) {
    cli.error("Invalid exception code.");

    return getExceptionCode(cli);
  }

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
  const root = testing ? "./repo-test" : ".";

  if (!await denoConfigExists(root)) {
    throw new Error(
      "Deno config does not exist. Please initialize a project first.",
    );
  }

  const config = await readDenoConfig(root);

  const cli = new Cli("EXC", {
    logLevel: logLevel,
    rgb24Color: 0x156AFF,
    displayName: "exception scaffolding",
  });

  cli.printBanner();
  cli.describe("intv8 exception tool.");

  const permissionsAccepted = await checkPermissions(PERMISSIONS);

  if (!permissionsAccepted) {
    cli.error("Permissions denied.");

    Deno.exit(10);
  }

  const featureName = getExceptionName(cli);
  const featureDescription = getExceptionDescription(cli);
  const exceptionMessage = (getExceptionMessage(cli)).replace(/"/g, '\\"');
  const exceptionCode = getExceptionCode(cli);

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
      code: exceptionCode.toString(16),
      message: exceptionMessage,
    },
  };

  const content = srcExceptionsExceptionTs(props);
  const modEntry = srcExceptionsModTsEntry(props);

  const fileName = createFilename(featureName);
  const filePath = `${root}/src/exceptions/${fileName}.ts`;
  const modPath = `${root}/src/exceptions/mod.ts`;

  const testContent = testsFeatureTs(props);
  const testFixtureContent = testsFixturesFixtureTs(props);

  if (await exists(filePath)) {
    cli.warn(`Exception ${featureName} already exists.`);

    const overwrite = cli.promptYesNo("Overwrite? (y/n)");

    if (!overwrite) {
      cli.error("Exception not created.");

      Deno.exit(12);
    }
  }

  cli.debug(`Writing exception to ${filePath}`);
  await Deno.writeTextFile(filePath, content);

  cli.debug(`Adding exception to exception mod file: ${modPath}`);
  await Deno.writeTextFile(modPath, modEntry, { append: true });

  cli.debug(`Writing test to ${root}/tests/${fileName}.test.ts`);
  await Deno.writeTextFile(`${root}/tests/${fileName}.test.ts`, testContent);

  cli.debug(
    `Writing test fixture to ${root}/tests/fixtures/${fileName}.fixtures.ts`,
  );
  await Deno.writeTextFile(
    `${root}/tests/fixtures/${fileName}.fixtures.ts`,
    testFixtureContent,
  );

  cli.done(`Exception ${featureName} created at ${filePath}.`);
  cli.describe("Review generated exception and resolve any TODOs.");
}
