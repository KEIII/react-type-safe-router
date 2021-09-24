import { ksBehaviourSubject } from '@keiii/k-stream';
import { FC } from 'react';
import URI from 'urijs';

import { RouterContext } from './RouterContext';
import { Router } from './types';

const router = ((): Router => {
  const getUri = () => new URI(window.location).origin('');

  const uri = ksBehaviourSubject(getUri());

  const fireEvent = () => {
    const nextUri = getUri();
    if (!uri.getValue().equals(nextUri)) {
      uri.next(nextUri);
    }
  };

  window.addEventListener('popstate', fireEvent);

  return {
    uri,
    push: uri => {
      window.history.pushState(null, '', String(uri));
      fireEvent();
    },
    replace: uri => {
      window.history.replaceState(null, '', String(uri));
      fireEvent();
    },
  };
})();

export const BrowserRouterProvider: FC = ({ children }) => {
  return (
    <RouterContext.Provider value={router}>{children}</RouterContext.Provider>
  );
};
