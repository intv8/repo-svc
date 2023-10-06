import { colors } from "../deps.ts";
import { printAsciiBanner } from "./print_ascii_banner.ts";

interface ICliOptions {
  logLevel: number;
  rgb24Color: number;
  displayName: string;
}

export class Cli {
  protected options: ICliOptions = {
    logLevel: 5,
    rgb24Color: 0x156AFF,
    displayName: "cli",
  };

  constructor(protected name: string, options: Partial<ICliOptions> = {}) {
    this.name = name;
    this.options.logLevel = options.logLevel === undefined
      ? 3
      : options.logLevel;
    this.options.rgb24Color = options.rgb24Color || 0x156AFF;
    this.options.displayName = options.displayName || name;
  }

  public printBanner(): void {
    printAsciiBanner(this.options.displayName);
  }

  public describe(message: string): void {
    console.log(
      `${this.printName()} ${colors.bold(colors.rgb24(message, 0x156AFF))}`,
    );
  }

  protected printName(): string {
    return colors.rgb24(`[${this.name}]`, this.options.rgb24Color);
  }

  public write(message: string): void {
    console.log(`${this.printName()} ${colors.reset(message)}`);
  }

  public done(message: string): void {
    console.log(`${this.printName()} ${colors.green(message)}`);
  }

  public prompt(message: string): string | null {
    return prompt(colors.bold(`${this.printName()} ${colors.reset(message)}:`));
  }

  public promptYesNo(message: string): boolean {
    const response = prompt(
      colors.bold(`${this.printName()} ${colors.reset(message)}:`),
    );

    if (response === "y" || response === "yes") return true;

    return false;
  }

  public promptDefault(message: string, defaultValue: string): string {
    const response = prompt(
      colors.bold(
        `${this.printName()} ${colors.reset(message)} (${defaultValue}):`,
      ),
    );

    if (!response && response !== "0") return defaultValue;

    return response;
  }

  public log(message: string): void {
    if (this.options.logLevel < 2) return;

    console.log(`${this.printName()} ${colors.reset(message)}`);
  }

  public error(message: string): void {
    if (this.options.logLevel < 1) return;

    console.error(`${this.printName()} ${colors.red(message)}`);
  }

  public warn(message: string): void {
    if (this.options.logLevel < 1) return;

    console.warn(`${this.printName()} ${colors.yellow(message)}`);
  }

  public info(message: string): void {
    if (this.options.logLevel < 3) return;

    console.info(`${this.printName()} ${colors.blue(message)}`);
  }

  public debug(message: string): void {
    if (this.options.logLevel < 4) return;

    console.debug(`${this.printName()} ${colors.gray(message)}`);
  }

  public trace(message: string): void {
    if (this.options.logLevel < 5) return;

    console.trace(`${this.printName()} ${colors.gray(message)}`);
  }

  public success(message: string): void {
    if (this.options.logLevel < 1) return;

    console.log(`${this.printName()} ${colors.green(message)}`);
  }
}
