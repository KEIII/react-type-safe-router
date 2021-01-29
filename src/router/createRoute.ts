import { FC } from 'react';
import utpl from 'uri-templates';
import { Decoder } from 'io-ts';
import * as O from 'fp-ts/Option';
import { Route, UriGenerator } from './types';

export const createRoute = <A>(args: {
  decoder: Decoder<unknown, A>;
  template: string;
  component: FC<A>;
}): Route<A> => {
  const uriTemplate = utpl(args.template);
  return {
    match: uri => {
      const params = uriTemplate.fromUri(uri) as unknown;
      if (params === undefined) return O.none; // unmatched
      return O.fromEither(args.decoder.decode(params));
    },
    uri: ((params?: A) => {
      return uriTemplate.fill(params ?? {});
    }) as UriGenerator<A>,
    component: args.component,
  };
};
