/**
 * This file exports exports the add_feature cli task.
 *
 * @copyright 2022 integer11. All rights reserved. MIT license.
 */

//  For checking Deno permissions.
import { checkPermissions } from "../check_permissions.ts";

//  For creating the feature file name from the feature name.
import { createFilename } from "../create_filename.ts";

//  For reading the deno config file.
import { denoConfigExists, readDenoConfig } from "../_internals/mod.ts";

//  For creating the feature file content.
import {
  classFeature,
  decoratorFeature,
  funcFeature,
  srcFeatureTs,
  srcInternalsFeatureTs,
  testsFeatureTs,
  testsFixturesFixtureTs,
} from "../files/mod.ts";

//  For creating the feature mod file export content.
import { srcModTsEntry } from "../partials/mod.ts";

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
  //  Get the feature type from the user
  cli.describe(
    "Enter a value matching the following: Class=c, Function=f, Decorator=d",
  );
  const featureType = cli.prompt("Enter feature type");

  //  Validate the feature type and prompt the user again if it is invalid
  if (!featureType) {
    cli.error("Invalid feature type.");

    return getFeatureType(cli);
  }

  if (!/^[cfd]$/.test(featureType)) {
    cli.error("Invalid feature type.");

    return getFeatureType(cli);
  }

  //  Return the feature type
  return featureType as FeatureType;
}

/**
 * Gets and validates the feature name from the user.
 *
 * @param cli The instance of the Cli class.
 * @returns The feature name.
 */
function getFeatureName(cli: Cli, featureType: FeatureType): string {
  //  Get the feature name from the user
  cli.describe(FEATURE_DESCRIPTIONS[featureType]);
  const featureName = cli.prompt("Enter feature name");

  //  Validate the feature name and prompt the user again if it is invalid
  if (!featureName) {
    cli.error("Invalid feature name.");

    return getFeatureName(cli, featureType);
  }

  if (!FEATURE_REGEXES[featureType].test(featureName)) {
    cli.error("Invalid feature name.");

    return getFeatureName(cli, featureType);
  }

  //  Return the feature name
  return featureName;
}

/**
 * Gets and validates the feature description from the user.
 *
 * @param cli The instance of the Cli class.
 * @returns The feature description.
 */
function getFeatureDescription(cli: Cli): string {
  //  Get the feature description from the user
  const featureDescription = cli.prompt("Enter feature description");

  //  Validate the feature description and prompt the user again if it is invalid
  if (!featureDescription) {
    cli.error("Invalid feature description.");

    return getFeatureDescription(cli);
  }

  //  Return the feature description
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
    displayName: "feature scaffolding",
  });

  //  Print the cli banner
  cli.printBanner();
  cli.describe("partic11e feature tool.");

  //  Check the permissions required by this task, and exit if they are not accepted
  const permissionsAccepted = await checkPermissions(PERMISSIONS);

  if (!permissionsAccepted) {
    cli.error("Permissions denied.");

    Deno.exit(10);
  }

  //  Get the exception name, description, message, and code from the user
  const featureType = getFeatureType(cli);
  const featureName = getFeatureName(cli, featureType);
  const featureDescription = getFeatureDescription(cli);
  const isInternal = cli.promptYesNo("Is this an internal feature?");

  const dir = isInternal ? `${root}/src/_internals` : `${root}/src`;

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
      type: featureType,
      description: featureDescription,
    },
  };

  //  Create the feature file content and the feature mod file entry
  const fileHeader = isInternal
    ? srcInternalsFeatureTs(props)
    : srcFeatureTs(props);
  const content = `${fileHeader}
${FEATURE_CONTENTS[featureType](props)}`;

  const modEntry = srcModTsEntry(props);

  //  Create the feature file name and path
  const fileName = createFilename(featureName);
  const filePath = `${dir}/${fileName}.ts`;
  const modPath = `${dir}/mod.ts`;

  const testContent = testsFeatureTs(props);
  const testFixtureContent = testsFixturesFixtureTs(props);

  //  Check if the feature file already exists
  //  If it does, prompt the user to overwrite it
  //  If they do not want to overwrite it, exit
  if (await exists(filePath)) {
    cli.warn(`${featureName} ${featureName} already exists.`);

    const overwrite = cli.promptYesNo("Overwrite? (y/n)");

    if (!overwrite) {
      cli.error("Feature not created.");

      Deno.exit(12);
    }
  }

  //  Write the feature file and add the feature to the mod file
  cli.debug(`Writing feature to ${filePath}`);
  await Deno.writeTextFile(filePath, content);

  cli.debug(`Adding feature to mod file: ${modPath}`);
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
  cli.done(`Feature ${featureName} created at ${filePath}.`);
  cli.describe("Review generated feature and resolve any TODOs.");
}
