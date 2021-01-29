import { Type, number, string, failure, success } from 'io-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import { chain } from 'fp-ts/lib/Either';

export interface NumberFromStringC extends Type<number, string> {}

export const NumberFromString: NumberFromStringC = new Type<
  number,
  string,
  unknown
>(
  'NumberFromString',
  number.is,
  (value, ctx) => {
    return pipe(
      string.validate(value, ctx),
      chain(str => {
        const num = Number(str);
        return isNaN(num) || str.trim() === ''
          ? failure(value, ctx)
          : success(num);
      }),
    );
  },
  String,
);
