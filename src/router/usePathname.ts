import { useRouter } from './RouterContext';
import { useLayoutEffect, useState } from 'react';

export const usePathname = () => {
  const router = useRouter();
  const [pathname, setPathname] = useState(router.pathname);

  useLayoutEffect(() => {
    return router.subscribe(setPathname);
  }, [router]);

  return pathname;
};
