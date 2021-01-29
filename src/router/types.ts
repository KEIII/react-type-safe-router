type Observer = (url: string) => void;

type Unsubscribe = () => void;

export type Router = {
  pathname: () => string;
  push: (url: string) => void;
  replace: (url: string) => void;
  subscribe: (observer: Observer) => Unsubscribe;
};
