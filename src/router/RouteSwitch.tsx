import { BehaviourSubject, ksBehaviourSubject } from '@keiii/k-stream';
import * as Option from 'fp-ts/Option';
import { Reducer, useLayoutEffect, useReducer, useRef } from 'react';

import { useRouter } from './RouterContext';
import { RouteSimple, RouteWithParams } from './types';

type Tuple = Array<unknown> &
  (
    | [void]
    | {
        length: number;
        every: (cb: (v: unknown, k: number) => boolean) => boolean;
        [k: number]: unknown;
      }
  );

const BlankComponent = () => <></>;

const shallowCompare = <T extends Tuple>(a: T, b: T) => {
  return a.length === b.length && a.every((v, k) => v === b[k]);
};

const reducer = <T extends Tuple>(a: T, b: T) => (shallowCompare(a, b) ? a : b);

const blank: ['Blank'] = ['Blank'];

/**
 * Renders the first one that matches the current URL.
 */
export const RouteSwitch = <P extends Record<string, unknown>>({
  routes,
}: {
  routes: (RouteSimple | RouteWithParams<P>)[];
}) => {
  const router = useRouter();

  type S =
    | ['Blank']
    | ['Simple', RouteSimple['component']]
    | ['WithParams', RouteWithParams<P>['component'], BehaviourSubject<P>];
  const [state, setState] = useReducer<Reducer<S, S>>(reducer, blank);
  const ref = useRef(state);
  ref.current = state;

  useLayoutEffect(() => {
    return router.uri.subscribe({
      next: activeUri => {
        for (const route of routes) {
          const paramsOption = route.match(activeUri);
          if (Option.isSome(paramsOption)) {
            const matchedParams = paramsOption.value;
            if (matchedParams !== null && typeof matchedParams === 'object') {
              // with params
              if (route.component === ref.current[1]) {
                // push new params if same component matched
                ref.current[2]?.next(matchedParams);
                return;
              } else {
                // new params stream
                return setState([
                  'WithParams',
                  route.component as RouteWithParams<P>['component'],
                  ksBehaviourSubject(matchedParams),
                ]);
              }
            } else {
              // simple route
              return setState([
                'Simple',
                route.component as RouteSimple['component'],
              ]);
            }
          }
        }
        return setState(blank);
      },
    }).unsubscribe;
  }, [router.uri, routes]);

  switch (state[0]) {
    case 'Blank': {
      return <BlankComponent />;
    }
    case 'WithParams': {
      const [, MatchedComponent, params] = state;
      return <MatchedComponent params={params} />;
    }
    case 'Simple': {
      const [, MatchedComponent] = state;
      return <MatchedComponent />;
    }
  }
};
