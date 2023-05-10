import { createTemplate } from "../create_template.ts";
import type { ExceptionProps, ExceptionPropsPath } from "../types/mod.ts";

export const srcExceptionsExceptionTs = createTemplate<
  ExceptionPropsPath,
  ExceptionProps
>`/**
 * This file exports the ${"feature.name"} exception and related features.
 *
 * @copyright 2022 integer11. All rights reserved. MIT license.
 */

//  Import base exception
import { Exception } from "../../deps.ts";

//  Import exception init type
export type { TExceptionInit } from "../../deps.ts";

/**
 * The default message for the ${"feature.name"} exception.
 */
const DEFAULT_MESSAGE = "${"exception.message"}";

/**
 * The exception init properties for the ${"feature.name"} exception.
 */
export type ${"feature.name"}Init = TExceptionInit<{
  //  TODO: Add init properties.
}>;

/**
 * Creates a message from the provided ${"feature.name"}Init properties.
 * 
 * @param init The ${"feature.name"}Init properties.
 * @returns The message created from the provided ${"feature.name"}Init properties.
 */
function createMsgFromInit (init: ${"feature.name"}Init): string {
  //  TODO: create message from provided init properties.
  //  e.g.
  //  const { prop1, prop2 } = init;
  //
  //  switch (true) {
  //    case (!!prop1 && !!prop2):
  //      return \`Prop1: \${prop1}, Prop2: \${prop2}\`;
  //    case (!!prop1):
  //      return \`Prop1: \${prop1}\`;
  //    case (!!prop2):
  //      return \`Prop2: \${prop2}\`;
  //    default:
  return DEFAULT_MESSAGE;  
  //  }
}

/**
 * ${"feature.description"}
 */
export class ${"feature.name"}Exception<T extends ${"feature.name"}Init = ${"feature.name"}Init> extends Exception<T> {
  /**
   * Creates a new ${"feature.name"} exception with the default message and no exception init properties.
   */
  constructor();

  /**
   * Creates a new ${"feature.name"} exception with a message created from the provided ${"feature.name"}Init properties.
   * 
   * @param init The ${"feature.name"}Init properties.
   */
  constructor(init: T);

  /**
   * Creates a new ${"feature.name"} exception with the provided message, optionally with additional ${"feature.name"}Init properties.
   * 
   * ***NOTE: The supplied message is not altered by the ${"feature.name"}Init properties.***
   * 
   * @param message The exception message.
   * @param init The ${"feature.name"}Init properties.
   */
  constructor(message: string, init?: T);

  //  Constructor overload implementation
  constructor(msgOrInit: string | T = DEFAULT_MSG, maybeInit?: T) {
    let message: string = msgOrInit as string;
    let init: T | undefined = maybeInit;

    if (typeof msgOrInit !== "string") {
      init = msgOrInit;
      message = msgFromInit(init);
    }

    super(message, init);
  }
  
  /**
   * The exception code for the ${"feature.name"} exception.
   */
  public code: number = ${"exception.code"};
}
`;
