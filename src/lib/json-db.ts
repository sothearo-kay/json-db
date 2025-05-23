import { Effect } from "effect";
import { resolve } from "path";
import { access, readFile, writeFile } from "fs/promises";
import type { IJsonDb } from "../types/json-db";

export class JsonDb<T extends { id: number }> implements IJsonDb<T> {
  private readonly filename: string;

  constructor(filename: string) {
    this.filename = resolve(process.cwd(), filename);
  }

  private async ensureFileExists(): Promise<void> {
    return access(this.filename).catch(() => writeFile(this.filename, "[]"));
  }

  private withFile<T>(fn: () => Promise<T>) {
    return Effect.tryPromise({
      try: async () => {
        await this.ensureFileExists();
        return await fn();
      },
      catch: (error) => new Error(String(error)),
    });
  }

  private read() {
    return this.withFile(async () => {
      const content = await readFile(this.filename, "utf-8");
      return JSON.parse(content) as T[];
    });
  }

  private write(data: T[]) {
    return this.withFile(async () => {
      writeFile(this.filename, JSON.stringify(data, null, 2));
    });
  }

  private withData<R>(
    fn: (data: T[]) => Effect.Effect<R, Error>,
  ): Effect.Effect<R, Error> {
    return Effect.gen(
      function* (this: JsonDb<T>) {
        const data = yield* this.read();
        return yield* fn(data);
      }.bind(this),
    );
  }

  add(item: T) {
    return this.withData((data) => {
      const exists = data.some((d) => d.id === item.id);
      if (exists) {
        return Effect.fail(
          new Error(`Item with id ${item.id} already exists.`),
        );
      }

      const updated = [...data, item];
      return Effect.flatMap(this.write(updated), () => Effect.succeed(item));
    });
  }

  addMany(items: T[]) {
    return this.withData((data) => {
      const existingIds = new Set(data.map((d) => d.id));
      const duplicate = items.find((item) => existingIds.has(item.id));

      if (duplicate) {
        return Effect.fail(
          new Error(`Item with id ${duplicate.id} already exists.`),
        );
      }

      const updated = [...data, ...items];
      return Effect.flatMap(this.write(updated), () => Effect.succeed(items));
    });
  }

  get(n: number) {
    return this.withData((data) => Effect.succeed(data.slice(0, n)));
  }

  getAll() {
    return this.read();
  }

  getBy(query: Partial<T>) {
    return this.withData((data) =>
      Effect.succeed(
        data.filter((item) =>
          Object.entries(query).every(
            ([key, value]) => item[key as keyof T] === value,
          ),
        ),
      ),
    );
  }

  update() {
    return Effect.fail(new Error("Not implemented"));
  }

  updateById() {
    return Effect.fail(new Error("Not implemented"));
  }

  deleteById() {
    return Effect.fail(new Error("Not implemented"));
  }
}
