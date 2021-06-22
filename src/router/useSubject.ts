import { BehaviourSubject } from '@keiii/k-stream';
import { Reducer, useLayoutEffect, useReducer } from 'react';

export const useSubject = <T>(subject: BehaviourSubject<T>): T => {
  const [value, next] = useReducer<Reducer<T, T>>(
    (_, action) => action,
    subject.value,
  );

  useLayoutEffect(() => {
    next(subject.value);
    return subject.subscribe({ next }).unsubscribe;
  }, [subject]);

  return value;
};
