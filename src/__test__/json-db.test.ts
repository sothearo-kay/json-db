import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { Effect } from "effect";
import { JsonDb } from "../lib/json-db";
import { rm } from "fs/promises";

type Book = {
  id: number;
  title: string;
};

const TEST_DB_FILE = "books.test.json";

describe("JsonDb", () => {
  let db: JsonDb<Book>;

  beforeEach(async () => {
    db = new JsonDb<Book>(TEST_DB_FILE);
    await db.clear().pipe(
      Effect.catchAll(() => Effect.succeed([])),
      Effect.runPromise,
    );
  });

  afterAll(async () => {
    await rm(TEST_DB_FILE, { force: true });
  });

  it("add and retrieves a book", async () => {
    const book = { id: 1, title: "Effect for Dummies" };
    await Effect.runPromise(db.add(book));

    const all = await Effect.runPromise(db.getAll());
    expect(all).toHaveLength(1);
    expect(all[0]).toEqual(book);
  });

  it("prevents duplicate ids", async () => {
    const book = { id: 1, title: "First Book" };
    await Effect.runPromise(db.add(book));

    const result = await Effect.runPromise(Effect.either(db.add(book)));

    expect(result._tag).toBe("Left");
    if (result._tag === "Left") {
      expect(result.left.message).toMatch(/already exists/);
    }
  });
});
