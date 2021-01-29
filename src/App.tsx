import { RouteSwitch } from './router/RouteSwitch';
import { createRoute, Route } from './router/route';
import { Link } from './router/Link';
import { BrowserRouter } from './router/BrowserRouter';
import { FC } from 'react';
import { some } from './router/option';

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
  match: () => some(null),
  build: () => {
    throw new Error('Logic Error');
  },
  component: () => <div>Not Found</div>,
};

const routeMap = {
  home: createRoute({
    template: '/',
    component: page('Home'),
  }),
  rfc: createRoute({
    template: '/date/{colour}/{shape}/',
    component: page('Color & Shape'),
  }),
  items: createRoute({
    template: '/items',
    component: itemList,
  }),
  item: createRoute({
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
          <Link url={routeMap.rfc.build({})}>RFC 6570</Link>
        </li>
      </ul>
      <RouteSwitch routes={routeList} />
    </BrowserRouter>
  );
};
