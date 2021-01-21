import { FC } from 'react';
import UrlPattern from 'url-pattern';

type ParamValue = string | number;

export type RouteParams<T> = string extends T
  ? Record<ParamValue, ParamValue>
  : T extends `${infer _Start}:${infer Param}/${infer Rest}`
  ? { [k in Param | keyof RouteParams<Rest>]: ParamValue }
  : T extends `${infer _Start}:${infer Param}`
  ? { [k in Param]: ParamValue }
  : {};

export type Route<T = unknown> = {
  match: (pathname: string) => boolean;
  build: (params: RouteParams<T>) => string;
  component: FC;
};

export const createRoute = <T extends string>(x: {
  template: T;
  component: FC;
}): Route<T> => {
  const pattern = new UrlPattern(x.template);
  return {
    match: pathname => pattern.match(pathname) !== null,
    build: params => pattern.stringify(params),
    component: x.component,
  };
};
