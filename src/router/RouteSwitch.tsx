import { FC } from 'react';
import { Route } from './route';
import * as O from 'fp-ts/Option';
import { usePathname } from './usePathname';

/**
 * Renders the first one that matches the current URL.
 */
export const RouteSwitch: FC<{ routes: Route[] }> = ({ routes }) => {
  const activePathname = usePathname();
  for (const route of routes) {
    const params = route.match(activePathname);
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
