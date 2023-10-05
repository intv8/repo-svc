/**
 * This file exports the getRepoDetails function.
 *
 * @copyright 2022 integereleven. All rights reserved. MIT license.
 */

const DEC = new TextDecoder("utf-8");

/**
 * This function returns the org and repo name for the current repo.
 *
 * @returns The org and repo name for the current repo
 */
export async function getRepoDetails(): Promise<[string, string]> {
  const regex = /\/([\w\-]+)\/([\w\-]+)/;
  const cmd = new Deno.Command("git", {
    args: ["remote", "-v"],
    stdout: "piped",
  });

  const p = cmd.spawn();

  const { stdout } = await p.output();
  const outStr = DEC.decode(stdout);
  const [line] = outStr.split("\n");
  console.log(`Extracting git output from:\n${outStr}`);

  const matches = regex.exec(line || "");

  if (!line || !matches) {
    throw new Error(
      `Unable to get git repo info for path ${import.meta.url}`,
    );
  }

  const [_match, org, repo] = matches;

  return [org, repo];
}
