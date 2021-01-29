import { FC } from 'react';
import { RouterContext } from './RouterContext';
import { Router } from './types';

const browserRouter = ((): Router => {
  const uri = () => {
    let p = window.location.pathname;
    const q = window.location.search;
    return q ? `${p}${q}` : p;
  };
  const observers = new Map<symbol, Function>();
  const fireEvent = () => observers.forEach(observer => observer(uri()));

  window.addEventListener('popstate', fireEvent);

  return {
    uri,
    push: uri => {
      window.history.pushState(null, '', uri);
      fireEvent();
    },
    replace: uri => {
      window.history.replaceState(null, '', uri);
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
