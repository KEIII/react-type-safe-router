import { BehaviourSubject } from '@keiii/k-stream';
import { Reducer, useLayoutEffect, useReducer } from 'react';

export const useBehaviourSubject = <T>(s: BehaviourSubject<T>): T => {
  const [value, next] = useReducer<Reducer<T, T>>(
    (_, action) => action,
    s.getValue(),
  );

  useLayoutEffect(() => s.subscribe({ next }).unsubscribe, [s]);

  return value;
};
