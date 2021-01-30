import { FC } from 'react';
import utpl from 'uri-templates';
import { Decoder, exact, HasProps } from 'io-ts';
import * as O from 'fp-ts/Option';
import { Route, UriGenerator } from './types';

type DecoderT<A> = Decoder<unknown, A> & HasProps;

/**
 * Create router based on RFC 6570 template.
 * @link https://tools.ietf.org/html/rfc6570
 */
export const createRoute = <A>(args: {
  decoder: DecoderT<A>;
  template: string;
  component: FC<A>;
}): Route<A> => {
  const uriTemplate = utpl(args.template);
  const decode = exact(args.decoder).decode;
  return {
    match: uri => {
      const params = uriTemplate.fromUri(uri) as unknown;
      if (params === undefined) return O.none; // unmatched
      return O.fromEither(decode(params));
    },
    uri: ((params?: A) => {
      return uriTemplate.fill(params ?? {});
    }) as UriGenerator<A>,
    component: args.component,
  };
};
