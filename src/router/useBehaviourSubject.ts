import { BehaviourSubject } from '@keiii/k-stream';
import { Reducer, useLayoutEffect, useReducer } from 'react';

export const useBehaviourSubject = <T>(subject: BehaviourSubject<T>): T => {
  const [value, next] = useReducer<Reducer<T, T>>(
    (_, action) => action,
    subject.value,
  );

  useLayoutEffect(() => {
    next(subject.value); // observable value may change beetween render and value commit
    return subject.subscribe({ next }).unsubscribe;
  }, [subject]);

  return value;
};
