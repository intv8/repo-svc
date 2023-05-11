/**
 * This file exports exports the get_commit cli task.
 *
 * @copyright 2022 integer11. All rights reserved. MIT license.
 */

//  For checking Deno permissions.
import { checkPermissions } from "../check_permissions.ts";

//  For reading and writing the deno config.
import { denoConfigExists, readDenoConfig } from "../_internals/mod.ts";

//  For creating the cli.
import { Cli } from "../cli.ts";

//  The permissions required by this task.
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
  //  Prompt the user for the commit type
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

  //  Validate the version type and prompt the user again if it is invalid
  if (!commitType || !Object.values(COMMIT_CODES).includes(commitType)) {
    cli.error("Invalid commit type.");

    Deno.exit(11);
  }

  //  Return the version type
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
  //  Get the root directory of the repo
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
  const cli = new Cli("COMMIT", {
    logLevel: logLevel,
    rgb24Color: 0x156AFF,
    displayName: "project commit creation",
  });

  //  Print the cli banner
  cli.printBanner();
  cli.describe("partic11e repo commit tool.");

  //  Check the permissions required by this task, and exit if they are not accepted
  const permissionsAccepted = await checkPermissions(PERMISSIONS);

  if (!permissionsAccepted) {
    cli.error("Permissions denied.");

    Deno.exit(10);
  }

  //  Get the version type being bumped
  const commitType = getCommitType(cli);

  //  Get the commit scope
  const scope = cli.prompt("Enter commit scope (optional)");

  //  I the commit breaking
  const isBreakingChange = cli.promptYesNo("Is this a breaking change? (y/n)");

  //  Get the commit descriptions
  const descriptions = getDescriptions(cli, []);

  //  Get the issue IDs
  const issueIds = getIssueIds(cli, []);

  //  Tag the commit with the current version
  const tagWithCurrentVersion = cli.promptYesNo(
    "Tag commit with current version? (y/n)",
  );

  if (tagWithCurrentVersion) {
    const tagProcess = Deno.run({
      cmd: ["git", "tag", `v${config.version}`],
    });

    const tagStatus = await tagProcess.status();

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

  //  Create the commit message
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

  //  Print the commit message
  cli.info(`Commit message:\n${commitMessage}`);

  //  Prompt the user to commit
  const commit = cli.promptYesNo("Commit? (y/n)");

  //  If the user does not want to commit, exit
  if (!commit) {
    cli.error("Commit aborted.");

    cli.log(
      `Use the following command to commit manually:\n\n\tgit commit -a -m "${commitMessage}"`,
    );

    Deno.exit(11);
  }

  //  Commit the changes
  cli.info("Committing changes...");
  const commitProcess = Deno.run({
    cmd: ["git", "commit", "-a", "-m", commitMessage],
  });

  const commitStatus = await commitProcess.status();

  if (!commitStatus.success) {
    cli.error("Failed to commit changes.");

    cli.log(
      `Use the following command to commit manually:\n\n\tgit commit -a -m "${commitMessage}"`,
    );

    Deno.exit(11);
  }

  //  Print the success message
  cli.done("Commit successful.");
}
