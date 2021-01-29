import { FC } from 'react';
import utpl from 'uri-templates';
import { Decoder } from 'io-ts';
import * as O from 'fp-ts/Option';

type Uri<A> = A extends object ? (params: A) => string : () => string;

export type Route<A = unknown> = {
  match: (pathname: string) => O.Option<A>;
  uri: Uri<A>;
  component: FC<A>;
};

export const createRoute = <A>(args: {
  decoder: Decoder<unknown, A>;
  template: string;
  component: FC<A>;
}): Route<A> => {
  const uriTemplate = utpl(args.template);
  return {
    match: pathname => {
      const params = uriTemplate.fromUri(pathname) as unknown;
      if (params === undefined) return O.none; // unmatched
      return O.fromEither(args.decoder.decode(params));
    },
    uri: ((params?: A) => {
      return uriTemplate.fill(params ?? {});
    }) as Uri<A>,
    component: args.component,
  };
};
