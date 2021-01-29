import { FC } from 'react';
import utpl from 'uri-templates';
import { none, Option, some } from './option';

export type Route<A = unknown> = {
  match: (pathname: string) => Option<A>;
  build: (params: A) => string;
  component: FC<{ params: A }>;
};

export const createRoute = <A>(x: {
  template: string;
  component: FC;
}): Route<A> => {
  const uriTemplate = utpl(x.template);
  return {
    match: pathname => {
      const params = uriTemplate.fromUri(pathname) as any; // todo: no any
      return params ? some(params) : none;
    },
    build: params => uriTemplate.fillFromObject(params as any), // todo: no any
    component: x.component,
  };
};
