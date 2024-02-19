/**
 * This file exports exports the get_commit cli task.
 *
 * @copyright 2022 integereleven. All rights reserved. MIT license.
 */

import { checkPermissions } from "../check_permissions.ts";
import { denoConfigExists, readDenoConfig } from "../_internals/mod.ts";
import { Cli } from "../cli.ts";

const PERMISSIONS: Deno.PermissionDescriptor[] = [
  {
    name: "run",
    command: "git",
  },
];

const COMMIT_TYPES = {
  feat: "A new feature",
  fix: "A bug fix",
  docs: "Documentation only changes",
  style:
    "Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)",
  refactor: "A code change that neither fixes a bug nor adds a feature",
  perf: "A code change that improves performance",
  test: "Adding missing tests or correcting existing tests",
  chore:
    "Changes to the build process or auxiliary tools and libraries such as documentation generation",
};

const COMMIT_CODES = {
  feat: "f",
  fix: "x",
  docs: "d",
  style: "s",
  refactor: "r",
  perf: "p",
  test: "t",
  chore: "c",
};

const COMMIT_CODE_REVERSE = Object.fromEntries(
  Object.entries(COMMIT_CODES).map(([k, v]) => [v, k]),
);

function getCommitType(cli: Cli): string {
  cli.describe(
    `Commit types:
${
      Object.keys(COMMIT_TYPES).map((k: string) =>
        ` - ${k}(${COMMIT_CODES[k as keyof typeof COMMIT_CODES]}) = ${
          COMMIT_TYPES[k as keyof typeof COMMIT_TYPES]
        }`
      ).join("\n")
    }`,
  );
  const commitType = cli.prompt(
    `Enter commit type (${Object.values(COMMIT_CODES).join("/")})`,
  );

  if (!commitType || !Object.values(COMMIT_CODES).includes(commitType)) {
    cli.error("Invalid commit type.");

    Deno.exit(11);
  }

  return commitType;
}

function getDescriptions(cli: Cli, messages: string[]): string[] {
  cli.describe(`Enter commit descriptions. Enter a blank line to finish.
The first line will be used as the commit title.
The rest will be used as the commit body.`);

  const line = cli.prompt("Enter description");

  if (line) {
    messages.push(line);

    return getDescriptions(cli, messages);
  }

  if (messages.length === 0) {
    cli.error("No commit description entered.");

    Deno.exit(11);
  }

  return messages;
}

function getIssueIds(cli: Cli, messages: string[]): string[] {
  cli.describe(`Enter issue IDs. Enter a blank line to finish.
The first line will be used as the commit title.
The rest will be used as the commit footer.`);

  const line = cli.prompt("Enter issue ID");

  if (line) {
    messages.push(line);

    return getIssueIds(cli, messages);
  }

  return messages;
}

/**
 * This function helps generate a commit message, optionally prompting the user to commit.
 *
 * @param testing Whether or not the task is being run in a test environment.
 * @param logLevel The log level to use.
 */
export async function commitTask(testing = false, logLevel = 3): Promise<void> {
  const root = testing ? "./repo-test" : ".";

  if (!await denoConfigExists(root)) {
    throw new Error(
      "Deno config does not exist. Please initialize a project first.",
    );
  }

  const config = await readDenoConfig(root);

  const cli = new Cli("COMMIT", {
    logLevel: logLevel,
    rgb24Color: 0x156AFF,
    displayName: "project commit creation",
  });

  cli.printBanner();
  cli.describe("kz.io repo commit tool.");

  const permissionsAccepted = await checkPermissions(PERMISSIONS);

  if (!permissionsAccepted) {
    cli.error("Permissions denied.");

    Deno.exit(10);
  }

  const commitType = getCommitType(cli);

  const scope = cli.prompt("Enter commit scope (optional)");

  const isBreakingChange = cli.promptYesNo("Is this a breaking change? (y/n)");

  const descriptions = getDescriptions(cli, []);

  const issueIds = getIssueIds(cli, []);

  const tagWithCurrentVersion = cli.promptYesNo(
    "Tag commit with current version? (y/n)",
  );

  if (tagWithCurrentVersion) {
    const tagProcess = new Deno.Command("git", {
      args: ["tag", `v${config.version}`],
      stderr: "piped",
    });

    const tagStatus = await tagProcess.output();

    if (tagStatus.success) {
      cli.success(`Tagged commit with v${config.version}.`);
    } else {
      cli.error(`Failed to tag commit with v${config.version}.`);
      cli.log(
        `Use the following command to tag manually:\n\n\tgit tag v${config.version}`,
      );

      Deno.exit(11);
    }
  }

  const commitTitle = descriptions.shift();
  const commitMessage = `${
    COMMIT_CODE_REVERSE[commitType as keyof typeof COMMIT_CODE_REVERSE]
  }${scope ? `(${scope})` : ""}${isBreakingChange ? "!" : ""}: ${commitTitle}${
    descriptions.length ? `\n${descriptions.join("\n").replace('"', '"')}` : ""
  }${
    issueIds.length
      ? `\n\nRefs: ${issueIds.map((id) => `#${id}`).join(",")}`
      : ""
  }`;

  cli.info(`Commit message:\n${commitMessage}`);

  const commit = cli.promptYesNo("Commit? (y/n)");

  if (!commit) {
    cli.error("Commit aborted.");

    cli.log(
      `Use the following command to commit manually:\n\n\tgit commit -a -m "${commitMessage}"`,
    );

    Deno.exit(11);
  }

  cli.info("Committing changes...");
  const commitProcess = new Deno.Command("git", {
    args: ["commit", "-a", "-m", commitMessage],
    stderr: "piped",
  });

  const commitStatus = await commitProcess.output();

  if (!commitStatus.success) {
    cli.error("Failed to commit changes.");
    cli.log(
      `Use the following command to commit manually:\n\n\tgit commit -a -m "${commitMessage}"`,
    );

    Deno.exit(11);
  }

  cli.done("Commit successful.");
}
