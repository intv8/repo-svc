/**
 * This file exports the getRepoDetails function.
 *
 * @copyright 2022 integer11. All rights reserved. MIT license.
 */

//  For decoding the output of the git command
const DEC = new TextDecoder("utf-8");

/**
 * This function returns the org and repo name for the current repo.
 *
 * @returns The org and repo name for the current repo
 */
export async function getRepoDetails(): Promise<[string, string]> {
  //  Run the git command to get the remote url
  const regex = /([\w\-]+)\/([\w\-]+)\.git/;
  const cmd = new Deno.Command("git", {
    cmd: ["remote", "-v"],
    stdout: "piped",
    stdin: "piped",
  });

  //  Get the output of the git command
  const output = await cmd.output();
  const outStr = DEC.decode(output);
  const [line] = outStr.split("\n");

  //  Parse the output of the git command
  const matches = regex.exec(line || "");

  //  Throw an error if the git command failed
  if (!line || !matches) {
    throw new Error(
      `Unable to get git repo info for path ${import.meta.url}`,
    );
  }

  //  Return the org and repo name
  const [_match, org, repo] = matches;

  return [org, repo];
}
