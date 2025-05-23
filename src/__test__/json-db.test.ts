import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { createJsonDb } from "../lib/json-db-wrapper";
import { rm } from "fs/promises";

type Book = {
  id: number;
  title: string;
};

const TEST_DB_FILE = "books.test.json";

describe("JsonDb (createJsonDb proxy)", () => {
  let db: ReturnType<typeof createJsonDb<Book>>;

  beforeEach(async () => {
    db = createJsonDb<Book>(TEST_DB_FILE);
    await db.clear();
  });

  afterAll(async () => {
    await rm(TEST_DB_FILE, { force: true });
  });

  it("adds and retrieves a book", async () => {
    const book = { id: 1, title: "Effect for Dummies" };
    await db.add(book);

    const all = await db.getAll();
    expect(all).toHaveLength(1);
    expect(all[0]).toEqual(book);
  });

  it("prevents duplicate ids", async () => {
    const book = { id: 1, title: "First Book" };
    await db.add(book);

    // Since add returns Promise now, we catch errors with try/catch instead of Effect.either
    let error: Error | null = null;
    try {
      await db.add(book);
    } catch (e) {
      error = e as Error;
    }

    expect(error).toBeInstanceOf(Error);
    expect(error?.message).toMatch(/already exists/i);
  });
});
