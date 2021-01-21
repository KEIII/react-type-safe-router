import { FC } from 'react';

export const Link: FC<{ url: string }> = ({ url, children }) => {
  return (
    <a
      href={url}
      onClick={e => {
        e.preventDefault();
        window.history.pushState(null, '', url);
      }}
    >
      {children}
    </a>
  );
};
