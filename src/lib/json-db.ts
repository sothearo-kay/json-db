import fs from "node:fs/promises";
import path from "node:path";
import { Effect } from "effect";
import { IJsonDb } from "../types/json-db";

export class JsonDb<T extends { id: number }> implements IJsonDb<T> {
  private static instance: JsonDb<any> | null = null;
  private constructor(private filePath: string) {}

  static getInstance<T extends { id: number }>(
    filename = "db.json",
  ): JsonDb<T> {
    if (!JsonDb.instance) {
      const filePath = path.resolve(process.cwd(), filename);
      JsonDb.instance = new JsonDb<T>(filePath);
    }
    return JsonDb.instance;
  }

  private read() {
    return Effect.tryPromise({
      try: async () => {
        const content = await fs.readFile(this.filePath, "utf-8");
        return JSON.parse(content) as T[];
      },
      catch: (error) => new Error(`Failed to read ${error}`),
    });
  }

  private write(data: T[]) {
    return Effect.tryPromise({
      try: () => fs.writeFile(this.filePath, JSON.stringify(data, null, 2)),
      catch: (error) => new Error(`Failed to write: ${error}`),
    });
  }
}
