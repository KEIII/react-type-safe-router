type Observer = (uri: string) => void;

type Unsubscribe = () => void;

export type Router = {
  pathname: () => string;
  push: (uri: string) => void;
  replace: (uri: string) => void;
  subscribe: (observer: Observer) => Unsubscribe;
};
