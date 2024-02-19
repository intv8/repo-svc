/**
 * This file exports the printAsciiBanner function.
 *
 * @copyright 2022 integereleven. All rights reserved. MIT license.
 */

import { colors } from "../deps.ts";

/**
 * The start and end indices of the color change in the kz.io banner.
 */
const [START, END] = [0, 17];

/**
 * Returns the unformatted kz.io banner with a tool name.
 *
 * @param name The name of the tool to print in the banner.
 * @returns The kz.io banner with the tool name.
 */
function createAsciiBanner(name: string): string {
  return `
▀██                    ██
 ██  ▄▄  ▄▄▄▄▄▄       ▄▄▄    ▄▄▄
 ██ ▄▀   ▀  ▄█▀        ██  ▄█  ▀█▄
 ██▀█▄    ▄█▀          ██  ██   ██
▄██▄ ██▄ ██▄▄▄▄█      ▄██▄  ▀█▄▄█▀
                  ██
  integereleven kz.io repository cli - ${name}
`;
}

/**
 * Prints a formatted kz.io banner with a tool name.
 *
 * @param name The name of the tool to print in the banner.
 */
export function printAsciiBanner(name: string): void {
  const lines = createAsciiBanner(name).split("\n").map((line) => {
    return line.split("").map((char, i) => {
      if (i >= START && i <= END) {
        return colors.rgb24(char, 0xDE492E);
      }

      return char === " " ? "\u00A0" : colors.rgb24(char, 0x585CA4);
    }).join("");
  });

  console.log(lines.join("\n"));
}
