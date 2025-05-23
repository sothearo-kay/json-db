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

  getAll() {
    return this.read();
  }

  get(n: number) {
    return Effect.map(this.read(), (data) => data.slice(0, n));
  }

  add(item: T) {
    return Effect.gen(
      function* (this: JsonDb<T>) {
        const data = yield* this.read();
        const updated = [...data, item];
        yield* this.write(updated);
        return item;
      }.bind(this),
    );
  }

  // Stub others for now
  getBy() {
    return Effect.fail(new Error("Not implemented"));
  }

  addMany() {
    return Effect.fail(new Error("Not implemented"));
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
