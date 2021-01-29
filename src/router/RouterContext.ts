import { createContext, useContext } from 'react';
import { Router } from './types';

export const RouterContext = createContext<Router | null>(null);

export const useRouter = (): Router => {
  const router = useContext(RouterContext);
  if (router === null) {
    throw new Error('Access Router outside RouterContext');
  }
  return router;
};
