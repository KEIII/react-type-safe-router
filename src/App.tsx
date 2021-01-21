import { RouteSwitch } from './router/RouteSwitch';
import { createRoute, Route } from './router/route';
import { Link } from './router/Link';

const page = (name: string) => () => <div>Page {name}</div>;

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
  match: () => true,
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
  items: createRoute({
    template: '/items',
    component: itemList,
  }),
  item: createRoute({
    template: '/item/:id',
    component: page('Item Detail'),
  }),
  notFound,
} as const;

const routeList = Object.values(routeMap) as Route[];

export const App = () => {
  return (
    <div>
      <ul>
        <li>
          <Link url={routeMap.home.build({})}>Home</Link>
        </li>
        <li>
          <Link url={routeMap.items.build({})}>Items</Link>
        </li>
      </ul>
      <RouteSwitch routes={routeList} />
    </div>
  );
};
