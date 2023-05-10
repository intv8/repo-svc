/**
 * This file exports exports the bump_version cli task.
 *
 * @copyright 2022 integer11. All rights reserved. MIT license.
 */

//  For checking Deno permissions.
import { checkPermissions } from "../check_permissions.ts";

//  For reading and writing the deno config.
import {
  denoConfigExists,
  readDenoConfig,
  writeDenoConfig,
} from "../_internals/mod.ts";

//  For creating the cli.
import { Cli } from "../cli.ts";

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

function getVersionBump(cli: Cli): string {
  //  Prompt the user for the version type being bumped
  cli.describe("M = Major, m = minor, p = patch");
  const versionType = cli.prompt("Enter version type (M/m/p):");

  //  Validate the version type and prompt the user again if it is invalid
  if (versionType !== "M" && versionType !== "m" && versionType !== "p") {
    cli.error("Invalid version type.");

    Deno.exit(11);
  }

  //  Return the version type
  return versionType;
}

/**
 * This function bumps the version in the deno config file and version file.
 *
 * @param testing Whether or not the task is being run in a test environment.
 * @param logLevel The log level to use.
 */
export async function bumpVersionTask(
  testing = false,
  logLevel = 3,
): Promise<void> {
  //  Get the root directory of the repo
  const root = testing ? "./repo-test" : "./";

  //  If the deno config file does not exist, throw an error
  if (!await denoConfigExists(root)) {
    throw new Error(
      "Deno config does not exist. Please initialize a project first.",
    );
  }

  //  Read the deno config file
  const config = await readDenoConfig(root);

  //  Get the current major, minor, and patch version numbers
  const [major, minor, patch] = config.version.split(".").map((v: string) =>
    parseInt(v, 10)
  );

  //  Create the cli
  const cli = new Cli("VBUMP", {
    logLevel: logLevel,
    rgb24Color: 0x156AFF,
    displayName: "project version bumping",
  });

  //  Print the cli banner
  cli.printBanner();
  cli.describe("partic11e repo versioning tool.");

  //  Check the permissions required by this task, and exit if they are not accepted
  const permissionsAccepted = await checkPermissions(PERMISSIONS);

  if (!permissionsAccepted) {
    cli.error("Permissions denied.");

    Deno.exit(10);
  }

  //  Get the version type being bumped
  const versionType = getVersionBump(cli);

  //  Bump the version
  const newVersion = versionType === "M"
    ? `${major + 1}.0.0`
    : versionType === "m"
    ? `${major}.${minor + 1}.0`
    : `${major}.${minor}.${patch + 1}`;

  //  Write the new version to the deno config file
  cli.info(`Bumping version from ${config.version} to ${newVersion}.`);
  await writeDenoConfig(root, { ...config, version: newVersion });

  //  Write the new version to the version file
  const versionFile = await Deno.readTextFile(`${root}/src/version.ts`);
  const newVersionFile = versionFile.replace(
    /export const VERSION = "[0-9]+\.[0-9]+\.[0-9]+";/,
    `export const VERSION = "${newVersion}";`,
  );

  await Deno.writeTextFile(`${root}/src/version.ts`, newVersionFile);

  //  Print the success message
  cli.done("Version bumped.");
  cli.describe(
    `Please commit changes with the tag 'v${newVersion}' (git commit -a v${newVersion} -m "version v${newVersion}")`,
  );
}
