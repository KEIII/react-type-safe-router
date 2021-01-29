import { FC } from 'react';
import { useRouter } from './RouterContext';
import { usePathname } from './usePathname';

type P = {
  uri: string;
  active?: string;
};

export const Link: FC<P> = props => {
  const router = useRouter();
  const active = usePathname() === props.uri;
  return (
    <a
      className={active ? props.active : ''}
      href={props.uri}
      onClick={event => {
        event.preventDefault();
        router.push(props.uri);
      }}
    >
      {props.children}
    </a>
  );
};
