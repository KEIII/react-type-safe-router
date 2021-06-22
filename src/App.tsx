import { RouteSwitch } from './router/RouteSwitch';
import { FC } from 'react';
import * as t from 'io-ts';
import { NumberFromString } from './NumberFromString';
import * as Option from 'fp-ts/Option';
import { Route } from './router/types';
import { useRouter } from './router/RouterContext';
import { routeSimple, routeWithParams } from './router/createRoute';
import URI from 'urijs';
import { BrowserRouterProvider as RouterProvider } from './router/BrowserRouterProvider';

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

const routeMap = {
  home,
  colourShape: routeWithParams({
    decoder: t.type({ colour: t.string, shape: t.string }),
    template: '/date/c-{colour}/s-{shape}/{?a,b}',
    component: page('Color & Shape'),
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
