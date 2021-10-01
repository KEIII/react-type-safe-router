import { BehaviourSubject } from '@keiii/k-stream';
import { Reducer, useLayoutEffect, useReducer } from 'react';

const reducer = <T>(_: T, x: T) => x;

export const useBehaviourSubject = <T>(s: BehaviourSubject<T>): T => {
  const [value, next] = useReducer<Reducer<T, T>>(reducer, s.getValue());

  useLayoutEffect(() => s.subscribe({ next }).unsubscribe, [s]);

  return value;
};
