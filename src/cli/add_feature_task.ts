/**
 * This file exports exports the add_feature cli task.
 *
 * @copyright 2022 integereleven. All rights reserved. MIT license.
 */

import { checkPermissions } from "../check_permissions.ts";
import { createFilename } from "../create_filename.ts";
import { denoConfigExists, readDenoConfig } from "../_internals/mod.ts";
import { srcModTsEntry } from "../partials/mod.ts";
import { Cli } from "../cli.ts";
import { exists } from "../../deps.ts";

import {
  classFeature,
  decoratorFeature,
  funcFeature,
  srcFeatureTs,
  srcInternalsFeatureTs,
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

type FeatureType = "c" | "f" | "d";

const FEATURE_DESCRIPTIONS: Record<FeatureType, string> = {
  c: "A class name must be PascalCase and contain only letters. (e.g. 'MyCustomClass')",
  f: "A function name must be camelCase and contain only letters. (e.g. 'myCustomFunction')",
  d: "A decorator name must be camelCase and contain only letters. (e.g. 'myCustomFunction')",
};

const FEATURE_REGEXES: Record<FeatureType, RegExp> = {
  c: /^[A-Z][a-zA-Z]+$/,
  f: /^[a-z][a-zA-Z]+$/,
  d: /^[a-z][a-zA-Z]+$/,
};

const FEATURE_CONTENTS = {
  c: classFeature,
  f: funcFeature,
  d: decoratorFeature,
} as const;

function getFeatureType(cli: Cli): FeatureType {
  cli.describe(
    "Enter a value matching the following: Class=c, Function=f, Decorator=d",
  );
  const featureType = cli.prompt("Enter feature type");

  if (!featureType) {
    cli.error("Invalid feature type.");

    return getFeatureType(cli);
  }

  if (!/^[cfd]$/.test(featureType)) {
    cli.error("Invalid feature type.");

    return getFeatureType(cli);
  }

  return featureType as FeatureType;
}

/**
 * Gets and validates the feature name from the user.
 *
 * @param cli The instance of the Cli class.
 * @returns The feature name.
 */
function getFeatureName(cli: Cli, featureType: FeatureType): string {
  cli.describe(FEATURE_DESCRIPTIONS[featureType]);
  const featureName = cli.prompt("Enter feature name");

  if (!featureName) {
    cli.error("Invalid feature name.");

    return getFeatureName(cli, featureType);
  }

  if (!FEATURE_REGEXES[featureType].test(featureName)) {
    cli.error("Invalid feature name.");

    return getFeatureName(cli, featureType);
  }

  return featureName;
}

/**
 * Gets and validates the feature description from the user.
 *
 * @param cli The instance of the Cli class.
 * @returns The feature description.
 */
function getFeatureDescription(cli: Cli): string {
  const featureDescription = cli.prompt("Enter feature description");

  if (!featureDescription) {
    cli.error("Invalid feature description.");

    return getFeatureDescription(cli);
  }

  return featureDescription;
}

/**
 * This function creates a new feature in the repo and adds it to the mod file.
 *
 * @param testing Whether the task is being run in testing mode.
 * @param logLevel The log level to use.
 */
export async function addFeatureTask(
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
    displayName: "feature scaffolding",
  });

  cli.printBanner();
  cli.describe("intv8 feature tool.");

  const permissionsAccepted = await checkPermissions(PERMISSIONS);

  if (!permissionsAccepted) {
    cli.error("Permissions denied.");

    Deno.exit(10);
  }

  const featureType = getFeatureType(cli);
  const featureName = getFeatureName(cli, featureType);
  const featureDescription = getFeatureDescription(cli);
  const isInternal = cli.promptYesNo("Is this an internal feature?");

  const dir = isInternal ? `${root}/src/_internals` : `${root}/src`;

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
      type: featureType,
      description: featureDescription,
    },
  };

  const fileHeader = isInternal
    ? srcInternalsFeatureTs(props)
    : srcFeatureTs(props);
  const content = `${fileHeader}
${FEATURE_CONTENTS[featureType](props)}`;

  const modEntry = srcModTsEntry(props);

  const fileName = createFilename(featureName);
  const filePath = `${dir}/${fileName}.ts`;
  const modPath = `${dir}/mod.ts`;

  const testContent = testsFeatureTs(props);
  const testFixtureContent = testsFixturesFixtureTs(props);
  
  if (await exists(filePath)) {
    cli.warn(`${featureName} ${featureName} already exists.`);

    const overwrite = cli.promptYesNo("Overwrite? (y/n)");

    if (!overwrite) {
      cli.error("Feature not created.");

      Deno.exit(12);
    }
  }

  cli.debug(`Writing feature to ${filePath}`);
  await Deno.writeTextFile(filePath, content);

  cli.debug(`Adding feature to mod file: ${modPath}`);
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

  cli.done(`Feature ${featureName} created at ${filePath}.`);
  cli.describe("Review generated feature and resolve any TODOs.");
}
