import { FC } from 'react';
import * as O from 'fp-ts/Option';
import { useActiveUri } from './useActiveUri';
import { Route } from './types';

/**
 * Renders the first one that matches the current URL.
 */
export const RouteSwitch: FC<{ routes: Route[] }> = ({ routes }) => {
  const activeUri = useActiveUri();
  for (const route of routes) {
    const params = route.match(activeUri);
    if (O.isSome(params)) {
      const props = params.value;
      return props !== null && typeof props === 'object' ? (
        <route.component {...props} />
      ) : (
        <route.component />
      );
    }
  }
  return <></>;
};
