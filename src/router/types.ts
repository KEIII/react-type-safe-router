import * as O from 'fp-ts/Option';
import { FC } from 'react';

type Observer = (uri: string) => void;

type Unsubscribe = () => void;

export type Router = {
  uri: () => string;
  push: (uri: string) => void;
  replace: (uri: string) => void;
  subscribe: (observer: Observer) => Unsubscribe;
};

export type RouteWithParams<A extends Record<string, any>> = {
  match: (uri: string) => O.Option<A>;
  uri: (params: A) => string;
  component: FC<A>;
};

export type RouteSimple = {
  match: (uri: string) => O.Option<null>;
  uri: () => string;
  component: FC;
};

export type Route<A = unknown> = A extends Record<string, any>
  ? RouteWithParams<A>
  : RouteSimple;
