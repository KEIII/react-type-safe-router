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

export type UriGenerator<A> = A extends object
  ? (params: A) => string
  : () => string;

export type Route<A = unknown> = {
  match: (uri: string) => O.Option<A>;
  uri: UriGenerator<A>;
  component: FC<A>;
};
