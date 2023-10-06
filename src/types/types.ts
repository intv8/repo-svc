/**
 * This file exports type aliases used by the the intv8 repo-svc package
 * and its peer and dependant packages.
 *
 * For interfaces, see ./interfaces.ts
 *
 * @copyright 2022 integereleven. All rights reserved. MIT license.
 */

export type TemplateCallback<T extends Props> = (props: T) => string;

type StringPath<T> = T extends string ? [] : {
  [K in Extract<keyof T, string>]: [K, ...StringPath<T[K]>];
}[Extract<keyof T, string>];

type JoinPath<T extends string[], D extends string> = T extends [] ? never
  : T extends [infer F] ? F
  : T extends [infer F, ...infer R]
    ? F extends string ? `${F}${D}${JoinPath<Extract<R, string[]>, D>}`
    : never
  : string;

export type Props = {
  // deno-lint-ignore no-explicit-any
  [key: string]: any;
};

type MetaProps = {
  meta: {
    year: string;
    date: string;
  };
};

export type PackageProps = MetaProps & {
  pkg: {
    name: string;
    description: string;
    version: string;
    status: string;
  };
};

export type PackagePropsPath = JoinPath<StringPath<PackageProps>, ".">;

export type FeatureProps = PackageProps & {
  feature: {
    name: string;
    type: string;
    description: string;
  };
};

export type FeaturePropsPath = JoinPath<StringPath<FeatureProps>, ".">;

export type ExceptionProps = FeatureProps & {
  exception: {
    message: string;
    code: string;
  };
};

export type ExceptionPropsPath = JoinPath<StringPath<ExceptionProps>, ".">;
