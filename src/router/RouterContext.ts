import { createContext, useContext } from 'react';
import { Router } from './types';
import { useSubject } from './useSubject';

export const RouterContext = createContext<Router | null>(null);

export const useRouter = (): Router => {
  const router = useContext(RouterContext);
  if (router === null) {
    throw new Error('Access Router outside RouterContext');
  }
  return router;
};

export const useActiveUri = () => useSubject(useRouter().uri);
