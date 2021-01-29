import { FC } from 'react';
import { RouterContext } from './RouterContext';
import { Router } from './types';

const browserRouter = ((): Router => {
  const pathname = () => window.location.pathname;
  const observers = new Map<symbol, Function>();
  const fireEvent = () => observers.forEach(observer => observer(pathname()));

  window.addEventListener('popstate', fireEvent);

  return {
    pathname,
    push: url => {
      window.history.pushState(null, '', url);
      fireEvent();
    },
    replace: url => {
      window.history.replaceState(null, '', url);
      fireEvent();
    },
    subscribe: observer => {
      const uid = Symbol();
      observers.set(uid, observer);
      return () => void observers.delete(uid);
    },
  };
})();

export const BrowserRouter: FC = ({ children }) => {
  return (
    <RouterContext.Provider value={browserRouter}>
      {children}
    </RouterContext.Provider>
  );
};
