/**
 * This file exports the printAsciiBanner function.
 *
 * @copyright 2022 integer11. All rights reserved. MIT license.
 */

//  For formatting the banner output
import { colors } from "../deps.ts";

/**
 * The start and end indices of the color change in the partic11e banner.
 */
const [START, END] = [44, 55];

/**
 * Returns the unformatted partic11e banner with a tool name.
 *
 * @param name The name of the tool to print in the banner.
 * @returns The partic11e banner with the tool name.
 */
function createAsciiBanner(name: string): string {
  return `
                          d8   ,e,            d88   d88
888 88e   ,"Y88b 888,8,  d88    "   e88'888  d888  d888  ,e e,
888 888b "8" 888 888 "  d88888 888 d888  '8 d"888 d"888 d88 88b
888 888P ,ee 888 888     888   888 Y888   ,   888   888 888   ,
888 88"  "88 888 888     888   888  "88,e8'   888   888  "YeeP"
888
888                      integer11 partic11e repository cli - ${name}
`;
}

/**
 * Prints a formatted partic11e banner with a tool name.
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
