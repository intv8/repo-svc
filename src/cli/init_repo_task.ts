/**
 * This file exports exports the init_repo cli task.
 *
 * @copyright 2022 integereleven. All rights reserved. MIT license.
 */

import { checkPermissions } from "../check_permissions.ts";
import { Cli } from "../cli.ts";
import { exists } from "../../deps.ts";

import {
  contributing,
  denoJsonc,
  denoWorkflow,
  depsTs,
  devDepsTs,
  importMapJson,
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

import {
  getRepoDetails,
  readDenoConfig,
  writeDenoConfig,
} from "../_internals/mod.ts";

import type { PackageProps } from "../types/mod.ts";

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
  "import_map.json": importMapJson,
  ".github/workflows/deno.yml": denoWorkflow,
};

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
 * This function initializes a repo with the intv8 repo scaffold.
 *
 * @param testing Whether or not the task is being run in a test environment.
 * @param logLevel The log level to use.
 */
export async function initRepoTask(
  testing = false,
  logLevel = 3,
): Promise<void> {
  const cli = new Cli("INIT", {
    logLevel: logLevel,
    rgb24Color: 0x156AFF,
    displayName: "project scaffolding",
  });

  cli.printBanner();
  cli.describe("intv8 repo scaffolding tool.");

  const permissionsAccepted = await checkPermissions(PERMISSIONS);
  if (!permissionsAccepted) {
    cli.error("Permissions denied.");

    Deno.exit(10);
  } else {
    cli.info("Permissions accepted.");
  }

  const root = testing ? "./repo-test" : ".";
  cli.debug(`Root directory: ${root}`);
  cli.log(`Scaffolding in directory ./${root} (${Deno.cwd()}\\${root})`);

  const [org, repo] = await getRepoDetails();

  let config = await readDenoConfig(root);

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

  if (!(await exists(root))) {
    await Deno.mkdir(root);
    cli.debug(`Created directory ${root}`);
  }

  await writeDenoConfig(root, config);

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

  for (const [file, template] of Object.entries(FILE_MAP)) {
    if (!(await exists(`${root}/${file}`))) {
      await Deno.writeTextFile(
        `${root}/${file}`,
        template(pkgProps).replace(/\&grave;/g, "`"),
      );

      cli.debug(`Created file ${root}/${file}`);
    }
  }

  cli.done("Scaffolding complete.");
}
