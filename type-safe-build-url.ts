type ParamValue = string | number;

type ExtractRouteParams<T> = string extends T
  ? Record<ParamValue, ParamValue>
  : T extends `${infer _Start}:${infer Param}/${infer Rest}`
  ? { [k in Param | keyof ExtractRouteParams<Rest>]: ParamValue }
  : T extends `${infer _Start}:${infer Param}`
  ? { [k in Param]: ParamValue }
  : {};

export const buildUrl = <T extends string>(
  path: T,
  params: ExtractRouteParams<T>
): string => {
  return Object.entries(params).reduce<string>((result, [key, value]) => {
    return result.replace(`:${key}`, String(value));
  }, path);
};

buildUrl("/product/:id/:page", { id: 42, page: 2 }); // OK
buildUrl("/product/:id/:page", { id: 42 }); // ERR:  Argument of type '{ id: number; }' is not assignable to parameter of type '{ id: ParamValue; page: ParamValue; }'
