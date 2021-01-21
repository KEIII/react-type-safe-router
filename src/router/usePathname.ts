import { useLayoutEffect, useState } from 'react';

const onLocationChange = (() => {
  const subscribers = new Map<symbol, Function>();
  const fireEvent = () => subscribers.forEach(sub => sub());

  const { pushState, replaceState } = window.history;

  window.history.pushState = (...args) => {
    pushState.apply(window.history, args);
    fireEvent();
  };

  window.history.replaceState = (...args) => {
    replaceState.apply(window.history, args);
    fireEvent();
  };

  window.addEventListener('popstate', fireEvent);

  return (subscriber: Function) => {
    const uid = Symbol();
    subscribers.set(uid, subscriber);
    return () => void subscribers.delete(uid);
  };
})();

const getPathname = () => {
  return window.location.pathname || '/';
};

export const usePathname = () => {
  const [state, setState] = useState(getPathname);

  useLayoutEffect(() => {
    return onLocationChange(() => setState(getPathname()));
  }, []);

  return state;
};
