import { FC, useLayoutEffect, useState } from 'react';
import { Route } from './route';
import { useRouter } from './RouterContext';

const usePathname = () => {
  const router = useRouter();
  const [pathname, setPathname] = useState(router.pathname);
  useLayoutEffect(() => router.subscribe(setPathname), [router]);
  return pathname;
};

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
