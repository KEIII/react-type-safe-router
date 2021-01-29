import { useRouter } from './RouterContext';
import { useLayoutEffect, useState } from 'react';

export const useActiveUri = () => {
  const router = useRouter();
  const [uri, setUri] = useState(router.uri);

  useLayoutEffect(() => {
    return router.subscribe(setUri);
  }, [router]);

  return uri;
};
