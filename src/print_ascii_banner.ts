/**
 * This file exports the printAsciiBanner function.
 *
 * @copyright 2022 integereleven. All rights reserved. MIT license.
 */

import { colors } from "../deps.ts";

/**
 * The start and end indices of the color change in the intv8 banner.
 */
const [START, END] = [0, 19];

/**
 * Returns the unformatted intv8 banner with a tool name.
 *
 * @param name The name of the tool to print in the banner.
 * @returns The intv8 banner with the tool name.
 */
function createAsciiBanner(name: string): string {
  return `
d8b          888              .d8888b.  
Y8P          888             d88P  Y88b 
             888             Y88b. d88P 
888 88888b.  888888 888  888  "Y88888"  
888 888 "88b 888    888  888 .d8P""Y8b. 
888 888  888 888    Y88  88P 888    888 
888 888  888 Y88b.   Y8bd8P  Y88b  d88P 
888 888  888  "Y888   Y88P    "Y8888P"

integereleven intv8 repository cli - ${name}
`;
}

/**
 * Prints a formatted intv8 banner with a tool name.
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
