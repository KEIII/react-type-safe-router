import { BehaviourSubject } from '@keiii/k-stream';
import * as Option from 'fp-ts/Option';
import * as t from 'io-ts';
import { FC } from 'react';
import URI from 'urijs';

import { NumberFromString } from './NumberFromString';
import { BrowserRouterProvider as RouterProvider } from './router/BrowserRouterProvider';
import { routeSimple, routeWithParams } from './router/createRoute';
import { useRouter } from './router/RouterContext';
import { RouteSwitch } from './router/RouteSwitch';
import { Route } from './router/types';
import { useBehaviourSubject } from './router/useBehaviourSubject';

const page = (name: string): FC => {
  return props => (
    <div>
      <div>Page {name}</div>
      <pre>{JSON.stringify(props)}</pre>
    </div>
  );
};

const Link: FC<{ uri: URI }> = props => {
  const router = useRouter();
  return (
    <a
      href={props.uri.href()}
      onClick={e => {
        e.preventDefault();
        router.push(props.uri);
      }}
    >
      {props.children}
    </a>
  );
};

const itemList = () => {
  return (
    <ul>
      <li>
        <Link uri={routeMap.item.uri({ id: 1 })}>Item ID=1</Link>
      </li>
    </ul>
  );
};

const notFound: Route = {
  match: () => Option.some(null),
  uri: () => {
    throw new Error('Logic Error');
  },
  component: () => <div>Not Found</div>,
};

const home = routeSimple({
  pathname: '/',
  component: page('Home'),
});

let i = 0;

const Debug = <T extends unknown>({
  value,
}: {
  value: BehaviourSubject<T>;
}) => {
  const x = useBehaviourSubject(value);
  return <pre>{JSON.stringify(x, null, 2)}</pre>;
};

const ColourShape = ({
  params,
}: {
  params: BehaviourSubject<{ colour: string; shape: string }>;
}) => {
  const router = useRouter();
  return (
    <div>
      <Debug value={params} />
      <div>
        <button
          onClick={() => {
            router.push(
              URI(`http://localhost:3000/date/c-orange/s-cube${i++}/`),
            );
          }}
        >
          Push State
        </button>
      </div>
    </div>
  );
};

const routeMap = {
  home,
  colourShape: routeWithParams({
    decoder: t.type({ colour: t.string, shape: t.string }),
    template: '/date/c-{colour}/s-{shape}/{?a,b}',
    component: ColourShape,
  }),
  items: routeSimple({
    pathname: '/items',
    component: itemList,
  }),
  item: routeWithParams({
    decoder: t.type({ id: NumberFromString }),
    template: '/item/{id}',
    component: page('Item Detail'),
  }),
  notFound,
} as const;

const routeList = Object.values(routeMap) as Route[];

export const App = () => {
  return (
    <RouterProvider>
      <ul>
        <li>
          <Link uri={routeMap.home.uri()}>Home</Link>
        </li>
        <li>
          <Link uri={routeMap.items.uri()}>Items</Link>
        </li>
        <li>
          <Link
            uri={routeMap.colourShape.uri({
              colour: 'orange',
              shape: 'cube',
            })}
          >
            Colour & Shape
          </Link>
        </li>
      </ul>
      <RouteSwitch routes={routeList} />
    </RouterProvider>
  );
};
