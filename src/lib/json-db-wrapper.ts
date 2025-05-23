import { Effect } from "effect";
import { JsonDb } from "./json-db";

type Asyncified<T> = {
  [K in keyof T]: T[K] extends (
    ...args: infer A
  ) => Effect.Effect<infer R, any, any>
    ? (...args: A) => Promise<R>
    : T[K];
};

export function createJsonDb<T extends { id: string | number }>(
  filename: string,
): Asyncified<JsonDb<T>> {
  const db = new JsonDb<T>(filename);

  return new Proxy(db, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      if (typeof value === "function") {
        return (...args: any[]) => {
          const result = value.apply(target, args);
          if (Effect.isEffect(result)) {
            // Narrow the type to ensure it's safe to run
            return Effect.runPromise(result as Effect.Effect<any, any, never>);
          }
          return result;
        };
      }
      return value;
    },
  }) as unknown as Asyncified<JsonDb<T>>;
}
