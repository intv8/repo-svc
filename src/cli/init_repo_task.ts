/**
 * This file exports exports the init_repo cli task.
 *
 * @copyright 2022 integer11. All rights reserved. MIT license.
 */

//  For checking permissions
import { checkPermissions } from "../check_permissions.ts";

//  For getting repo details
import {
  getRepoDetails,
  readDenoConfig,
  writeDenoConfig,
} from "../_internals/mod.ts";

//  For creating the cli task
import { Cli } from "../cli.ts";

//  For creating the file scaffold
import { exists } from "../../deps.ts";

//  For creating the file scaffolds
import {
  contributing,
  denoJsonc,
  depsTs,
  devDepsTs,
  license,
  readme,
  rootModTs,
  srcConstants,
  srcExceptionModTs,
  srcInternalsConstantsTs,
  srcInternalsModTs,
  srcModTs,
  srcTypesEnumsTs,
  srcTypesInterfacesTs,
  srcTypesModTs,
  srcTypesTypesTs,
  srcVersionTs,
} from "../files/mod.ts";

//  For describing data types
import type { PackageProps } from "../types/mod.ts";

//  The file map for the file scaffold
const FILE_MAP = {
  "src/_internals/mod.ts": srcInternalsModTs,
  "src/_internals/constants.ts": srcInternalsConstantsTs,
  "src/exceptions/mod.ts": srcExceptionModTs,
  "src/mod.ts": srcModTs,
  "src/constants.ts": srcConstants,
  "src/types/enums.ts": srcTypesEnumsTs,
  "src/types/interfaces.ts": srcTypesInterfacesTs,
  "src/types/types.ts": srcTypesTypesTs,
  "src/types/mod.ts": srcTypesModTs,
  "src/version.ts": srcVersionTs,
  "deps.ts": depsTs,
  "dev_deps.ts": devDepsTs,
  "mod.ts": rootModTs,
  "LICENSE": license,
  "README.md": readme,
  "CONTRIBUTING.md": contributing,
};

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
  {
    name: "run",
    command: "git",
  },
];

/**
 * This function initializes a repo with the partic11e repo scaffold.
 *
 * @param testing Whether or not the task is being run in a test environment.
 * @param logLevel The log level to use.
 */
export async function initRepoTask(
  testing = false,
  logLevel = 3,
): Promise<void> {
  //  Create the cli
  const cli = new Cli("INIT", {
    logLevel: logLevel,
    rgb24Color: 0x156AFF,
    displayName: "project scaffolding",
  });

  //  Print the banner
  cli.printBanner();
  cli.describe("partic11e repo scaffolding tool.");

  //  Check permissions
  const permissionsAccepted = await checkPermissions(PERMISSIONS);
  if (!permissionsAccepted) {
    cli.error("Permissions denied.");

    Deno.exit(10);
  } else {
    cli.info("Permissions accepted.");
  }

  //  Set root directory to repo root, or if testing to `repo-test` directory
  const root = testing ? "./repo-test" : ".";
  cli.debug(`Root directory: ${root}`);
  cli.log(`Scaffolding in directory ./${root} (${Deno.cwd()}\\${root})`);

  //  Get information from repo (pkg)
  const [org, repo] = await getRepoDetails();

  //  Read deno.jsonc
  let config = await readDenoConfig(root);

  //  If deno.jsonc is empty, initialize it with default values
  const json = denoJsonc({
    pkg: {
      description: "",
      name: repo,
      status: "unstable",
      version: "0.0.1",
    },
    meta: {
      date: new Date().toISOString(),
      year: (new Date().getFullYear()).toString(),
    },
  });
  const parsedJson = JSON.parse(json);

  if (!Object.keys(config).length) {
    config = parsedJson;
  } else {
    config = { ...parsedJson, ...config };
  }

  cli.debug(`Repo: ${org}/${repo}`);

  //  Get updated information from user (name, description, version, etc...) (pkg)
  config.name = cli.promptDefault("Project name", config.name || repo);
  config.description = cli.promptDefault(
    "Project description",
    config.description || "",
  );
  config.version = cli.promptDefault(
    "Project version",
    config.version || "0.0.1",
  );
  const stable = cli.promptYesNo("Is this a stable release?");
  const deprecated = cli.promptYesNo("Is this release deprecated?");
  config.status = stable ? "stable" : deprecated ? "deprecated" : "unstable";

  //  Create pkgProps object
  const pkgProps: PackageProps = {
    pkg: {
      description: config.description,
      name: config.name,
      status: config.status,
      version: config.version,
    },
    meta: {
      date: new Date().toISOString(),
      year: new Date().getFullYear().toString(),
    },
  };

  cli.debug(`Config: ${JSON.stringify(config)}`);

  //  ensure root directory exists
  if (!(await exists(root))) {
    await Deno.mkdir(root);
    cli.debug(`Created directory ${root}`);
  }

  //  Write/update deno.jsonc
  await writeDenoConfig(root, config);

  //  Create directory structure
  const folders = [
    "src",
    "src/_internals",
    "src/exceptions",
    "src/types",
    "tests",
    "tests/fixtures",
  ];

  for (const folder of folders) {
    if (!(await exists(`${root}/${folder}`))) {
      await Deno.mkdir(`${root}/${folder}`);

      cli.debug(`Created directory ${root}/${folder}`);
    }
  }

  //  Create files from templates
  for (const [file, template] of Object.entries(FILE_MAP)) {
    if (!(await exists(`${root}/${file}`))) {
      await Deno.writeTextFile(
        `${root}/${file}`,
        template(pkgProps).replace(/\&grave;/g, "`"),
      );

      cli.debug(`Created file ${root}/${file}`);
    }
  }

  //  Print success message
  cli.done("Scaffolding complete.");
}
