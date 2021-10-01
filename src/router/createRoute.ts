import { BehaviourSubject } from '@keiii/k-stream';
import { flow } from 'fp-ts/function';
import * as Option from 'fp-ts/Option';
import { Decoder, HasProps, exact } from 'io-ts';
import { FC } from 'react';
import utpl from 'uri-templates';
import URI from 'urijs';

import { RouteSimple, RouteWithParams } from './types';

type DecoderT<A> = Decoder<unknown, A> & HasProps;

/**
 * Create route based on RFC 6570 template.
 * @link https://tools.ietf.org/html/rfc6570
 */
export const routeWithParams = <A extends Record<string, unknown>>(args: {
  decoder: DecoderT<A>;
  template: string;
  component: FC<{ params: BehaviourSubject<A> }>;
}): RouteWithParams<A> => {
  const uriTemplate = utpl(args.template);
  const { decode, encode } = exact(args.decoder);
  return {
    match: flow(
      flow(String, uriTemplate.fromUri, Option.fromNullable),
      Option.chain(flow(decode, Option.fromEither)),
    ),
    uri: params => new URI(uriTemplate.fill(encode(params))),
    component: args.component,
  };
};

/**
 * Create route based on pathname.
 */
export const routeSimple = (args: {
  pathname: string;
  component: FC;
}): RouteSimple => {
  const routeUri = new URI({ path: args.pathname });
  return {
    match: uri => {
      return routeUri.path() === uri.path() ? Option.some(null) : Option.none;
    },
    uri: () => routeUri,
    component: args.component,
  };
};
