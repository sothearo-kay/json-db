import { Effect } from "effect";

export interface IJsonDb<T extends { id: string | number }> {
  get(n: number): Effect.Effect<T[], Error>;
  getAll(): Effect.Effect<T[], Error>;
  getBy(query: Partial<T>): Effect.Effect<T[], Error>;
  add(item: T): Effect.Effect<T, Error>;
  addMany(items: T[]): Effect.Effect<T[], Error>;
  update(query: Partial<T>, update: Partial<T>): Effect.Effect<number, Error>;
  updateById(id: T["id"], item: T): Effect.Effect<boolean, Error>;
  deleteById(id: T["id"]): Effect.Effect<boolean, Error>;
  clear(): Effect.Effect<T[], Error>;
}
