/**
 * This file exports exports the bump_version cli task.
 *
 * @copyright 2022 integereleven. All rights reserved. MIT license.
 */

import { checkPermissions } from "../check_permissions.ts";
import { Cli } from "../cli.ts";

import {
  denoConfigExists,
  readDenoConfig,
  writeDenoConfig,
} from "../_internals/mod.ts";

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
  cli.describe("M = Major, m = minor, p = patch");
  const versionType = cli.prompt("Enter version type (M/m/p):");

  if (versionType !== "M" && versionType !== "m" && versionType !== "p") {
    cli.error("Invalid version type.");

    Deno.exit(11);
  }

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
  const root = testing ? "./repo-test" : ".";

  if (!await denoConfigExists(root)) {
    throw new Error(
      "Deno config does not exist. Please initialize a project first.",
    );
  }

  const config = await readDenoConfig(root);

  const [major, minor, patch] = config.version.split(".").map((v: string) =>
    parseInt(v, 10)
  );

  const cli = new Cli("VBUMP", {
    logLevel: logLevel,
    rgb24Color: 0x156AFF,
    displayName: "project version bumping",
  });

  cli.printBanner();
  cli.describe("kz.io repo versioning tool.");

  const permissionsAccepted = await checkPermissions(PERMISSIONS);

  if (!permissionsAccepted) {
    cli.error("Permissions denied.");

    Deno.exit(10);
  }

  const versionType = getVersionBump(cli);

  const newVersion = versionType === "M"
    ? `${major + 1}.0.0`
    : versionType === "m"
    ? `${major}.${minor + 1}.0`
    : `${major}.${minor}.${patch + 1}`;

  cli.info(`Bumping version from ${config.version} to ${newVersion}.`);
  await writeDenoConfig(root, { ...config, version: newVersion });

  const versionFile = await Deno.readTextFile(`${root}/src/constants.ts`);
  const newVersionFile = versionFile.replace(
    /export const VERSION = "[0-9]+\.[0-9]+\.[0-9]+";/,
    `export const VERSION = "${newVersion}";`,
  );

  await Deno.writeTextFile(`${root}/src/version.ts`, newVersionFile);

  cli.done("Version bumped.");
  cli.describe(
    `Please commit changes with the tag 'v${newVersion}' (git commit -a v${newVersion} -m "version v${newVersion}")`,
  );
}
