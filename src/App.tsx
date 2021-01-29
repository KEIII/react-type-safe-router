import { RouteSwitch } from './router/RouteSwitch';
import { createRoute } from './router/createRoute';
import { Link } from './router/Link';
import { BrowserRouter as Router } from './router/BrowserRouter';
import { FC } from 'react';
import * as t from 'io-ts';
import { NumberFromString } from './NumberFromString';
import * as O from 'fp-ts/Option';
import { Route } from './router/types';

const page = (name: string): FC => {
  return props => (
    <div>
      <div>Page {name}</div>
      <pre>{JSON.stringify(props)}</pre>
    </div>
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
  match: () => O.some(null),
  uri: () => {
    throw new Error('Logic Error');
  },
  component: () => <div>Not Found</div>,
};

const home: Route = {
  uri: () => '/',
  match: uri => (uri === '/' ? O.some(null) : O.none),
  component: page('Home'),
};

const routeMap = {
  home,
  colourShape: createRoute({
    decoder: t.type({ colour: t.string, shape: t.string }),
    template: '/date/c-{colour}/s-{shape}/{?a,b}',
    component: page('Color & Shape'),
  }),
  items: createRoute({
    decoder: t.unknown,
    template: '/items',
    component: itemList,
  }),
  item: createRoute({
    decoder: t.type({ id: NumberFromString }),
    template: '/item/{id}',
    component: page('Item Detail'),
  }),
  notFound,
} as const;

const routeList = Object.values(routeMap) as Route[];

export const App = () => {
  return (
    <Router>
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
    </Router>
  );
};
