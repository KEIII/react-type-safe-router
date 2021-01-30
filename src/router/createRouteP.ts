import { FC } from 'react';
import utpl from 'uri-templates';
import { Decoder, exact, HasProps } from 'io-ts';
import * as O from 'fp-ts/Option';
import { RouteWithParams, RouteSimple } from './types';

type DecoderT<A> = Decoder<unknown, A> & HasProps;

/**
 * Create router based on RFC 6570 template.
 * @link https://tools.ietf.org/html/rfc6570
 */
export const routeWithParams = <A extends Record<string, any>>(args: {
  decoder: DecoderT<A>;
  template: string;
  component: FC<A>;
}): RouteWithParams<A> => {
  const uriTemplate = utpl(args.template);
  const decoder = exact(args.decoder);
  return {
    match: uri => {
      const params = uriTemplate.fromUri(uri) as unknown;
      if (params === undefined) return O.none; // unmatched
      return O.fromEither(decoder.decode(params));
    },
    uri: params => uriTemplate.fill(params),
    component: args.component,
  };
};

/**
 * Create router based on RFC 6570 template.
 * @link https://tools.ietf.org/html/rfc6570
 */
export const routeSimple = (args: {
  template: string;
  component: FC;
}): RouteSimple => {
  const uriTemplate = utpl(args.template);
  return {
    match: uri => {
      const params = uriTemplate.fromUri(uri) as unknown;
      return params !== undefined ? O.some(null) : O.none;
    },
    uri: () => uriTemplate.fill({}),
    component: args.component,
  };
};
