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
}
