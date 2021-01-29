import { FC } from 'react';
import { useRouter } from './RouterContext';

export const Link: FC<{ url: string }> = ({ url, children }) => {
  const router = useRouter();
  return (
    <a
      href={url}
      onClick={event => {
        event.preventDefault();
        router.push(url);
      }}
    >
      {children}
    </a>
  );
};
