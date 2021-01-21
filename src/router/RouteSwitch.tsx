import { FC } from 'react';
import { usePathname } from './usePathname';
import { Route } from './route';

/**
 * Renders the first one that matches the current URL.
 */
export const RouteSwitch: FC<{ routes: Route[] }> = ({ routes }) => {
  const pathname = usePathname();
  for (const route of routes) {
    if (route.match(pathname)) {
      return <route.component />;
    }
  }
  return <></>;
};
