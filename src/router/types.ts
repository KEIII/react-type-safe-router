import { BehaviourSubject } from '@keiii/k-stream';
import { Option } from 'fp-ts/Option';
import { FC } from 'react';
import URI from 'urijs';

export type Router = {
  uri: BehaviourSubject<URI>;
  push: (uri: URI) => void;
  replace: (uri: URI) => void;
};

export type RouteWithParams<A extends Record<string, unknown>> = {
  match: (uri: URI) => Option<A>;
  uri: (params: A) => URI;
  component: FC<A>;
};

export type RouteSimple = {
  match: (uri: URI) => Option<null>;
  uri: () => URI;
  component: FC;
};

export type Route<A = unknown> = A extends Record<string, unknown>
  ? RouteWithParams<A>
  : RouteSimple;
