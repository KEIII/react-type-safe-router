import { FC } from 'react';
import utpl from 'uri-templates';
import { Decoder } from 'io-ts';
import * as O from 'fp-ts/Option';

export type Route<A = unknown> = {
  match: (pathname: string) => O.Option<A>;
  build: (params: A) => string;
  component: FC<{ params: A }>;
};

export const createRoute = <A>(args: {
  decoder: Decoder<unknown, A>;
  template: string;
  component: FC;
}): Route<A> => {
  const uriTemplate = utpl(args.template);
  return {
    match: pathname => {
      const params = uriTemplate.fromUri(pathname) as unknown;
      if (params === undefined) return O.none; // unmatched
      return O.fromEither(args.decoder.decode(params));
    },
    build: params => {
      const vars = params !== null && typeof params === 'object' ? params : {};
      return uriTemplate.fillFromObject(vars);
    },
    component: args.component,
  };
};
