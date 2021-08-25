import { ksBehaviourSubject } from '@keiii/k-stream';
import { FC } from 'react';
import URI from 'urijs';

import { RouterContext } from './RouterContext';
import { Router } from './types';

const router = ((): Router => {
  const getUri = () => {
    const hash = window.location.hash;
    return new URI(hash === '' ? '/' : hash.slice(1));
  };

  const uri = ksBehaviourSubject(getUri());

  const fireEvent = () => {
    const nextUri = getUri();
    if (!uri.value.equals(nextUri)) {
      uri.next(nextUri);
    }
  };

  window.addEventListener('popstate', fireEvent);

  return {
    uri,
    push: uri => {
      window.history.pushState(null, '', `#${uri}`);
      fireEvent();
    },
    replace: uri => {
      window.history.replaceState(null, '', `#${uri}`);
      fireEvent();
    },
  };
})();

export const HashRouterProvider: FC = ({ children }) => {
  return (
    <RouterContext.Provider value={router}>{children}</RouterContext.Provider>
  );
};
