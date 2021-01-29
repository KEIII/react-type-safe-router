import { RouteSwitch } from './router/RouteSwitch';
import { createRoute, Route } from './router/route';
import { Link } from './router/Link';
import { BrowserRouter } from './router/BrowserRouter';
import { FC } from 'react';
import * as t from 'io-ts';
import { NumberFromString } from './NumberFromString';
import * as O from 'fp-ts/Option';

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
        <Link url={routeMap.item.build({ id: 1 })}>Item ID=1</Link>
      </li>
    </ul>
  );
};

const notFound: Route = {
  match: () => O.some(null),
  build: () => {
    throw new Error('Logic Error');
  },
  component: () => <div>Not Found</div>,
};

const routeMap = {
  home: createRoute({
    decoder: t.unknown,
    template: '/',
    component: page('Home'),
  }),
  colourShape: createRoute({
    decoder: t.type({ colour: t.string, shape: t.string }),
    template: '/date/c-{colour}/s-{shape}/',
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
    <BrowserRouter>
      <ul>
        <li>
          <Link url={routeMap.home.build({})}>Home</Link>
        </li>
        <li>
          <Link url={routeMap.items.build({})}>Items</Link>
        </li>
        <li>
          <Link
            url={routeMap.colourShape.build({
              colour: 'orange',
              shape: 'cube',
            })}
          >
            Colour & Shape
          </Link>
        </li>
      </ul>
      <RouteSwitch routes={routeList} />
    </BrowserRouter>
  );
};
